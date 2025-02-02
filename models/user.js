// models/user.js
const { ObjectId } = require('mongodb');
const { getDb } = require('../database/connect');
const { UserNotFoundError, DuplicateEmailError } = require('../helpers/errorTypes');

const getUserCollection = () => {
    const db = getDb();
    return db.collection('user');
};

class User {
    static async findAll() {
        const collection = getUserCollection();
        return await collection.find({}).toArray();
    }

    static async findById(id) {
        const collection = getUserCollection();
        const user = await collection.findOne({ _id: new ObjectId(id) });
        if (!user) {
            throw new UserNotFoundError(`No user found with id: ${id}`);
        }
        return user;
    }

    static async findByEmail(email) {
        const collection = getUserCollection();
        const user = await collection.findOne({ email });
        if (!user) {
            throw new UserNotFoundError(`No user found with email: ${email}`);
        }
        return user;
    }

    static async create(userData) {
        const collection = getUserCollection();
        
        // Check for existing user with same email
        const existingUser = await collection.findOne({ email: userData.email });
        if (existingUser) {
            throw new DuplicateEmailError();
        }

        const user = {
            ...userData,
            createdAt: new Date()
        };
        const result = await collection.insertOne(user);
        return { _id: result.insertedId, ...user };
    }

    static async update(id, updateData) {
        try {
            if (!ObjectId.isValid(id)) {
                throw new UserNotFoundError('Invalid user ID format');
            }
    
            const collection = getUserCollection();
            const objectId = new ObjectId(id);
            
            // Verify user exists first
            const existingUser = await collection.findOne({ _id: objectId });
            if (!existingUser) {
                throw new UserNotFoundError(`No user found with id: ${id}`);
            }
    
            // Check for email duplicates
            if (updateData.email && updateData.email !== existingUser.email) {
                const duplicateEmail = await collection.findOne({ 
                    email: updateData.email,
                    _id: { $ne: objectId }
                });
                if (duplicateEmail) {
                    throw new DuplicateEmailError();
                }
            }
    
            const result = await collection.findOneAndUpdate(
                { _id: objectId },
                { 
                    $set: {
                        ...updateData,
                        updatedAt: new Date()
                    }
                },
                { 
                    returnDocument: 'after'
                }
            );
    
            return result.value;
        } catch (error) {
            //console.error(`Error updating user:`, error);
            throw error;
        }
    }

    static async delete(id) {
        const collection = getUserCollection();
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 0) {
            throw new UserNotFoundError();
        }

        return result;
    }
}

module.exports = User;
