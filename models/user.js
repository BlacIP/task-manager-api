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
        const collection = getUserCollection();
        
        // If email is being updated, check for duplicates
        if (updateData.email) {
            const existingUser = await collection.findOne({ 
                email: updateData.email,
                _id: { $ne: new ObjectId(id) }
            });
            if (existingUser) {
                throw new DuplicateEmailError();
            }
        }

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { 
                $set: {
                    ...updateData,
                    updatedAt: new Date()
                }
            },
            { returnDocument: 'after' }
        );

        if (!result.value) {
            throw new UserNotFoundError();
        }

        return result.value;
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
