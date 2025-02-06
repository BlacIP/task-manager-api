// const { ObjectId } = require('mongodb');
// const { getDb } = require('../database/connect');
// const { UserNotFoundError, DuplicateEmailError } = require('../helpers/errorTypes');

// const getUserCollection = () => {
//     const db = getDb();
//     return db.collection('user');
// };

// class User {
//     static async findAll() {
//         const collection = getUserCollection();
//         return await collection.find({}).toArray();
//     }

//     static async findById(id) {
//         const collection = getUserCollection();
//         const user = await collection.findOne({ _id: new ObjectId(id) });
//         if (!user) {
//             throw new UserNotFoundError(`No user found with id: ${id}`);
//         }
//         return user;
//     }

//     static async findByEmail(email) {
//         const collection = getUserCollection();
//         const user = await collection.findOne({ email });
//         if (!user) {
//             throw new UserNotFoundError(`No user found with email: ${email}`);
//         }
//         return user;
//     }

//     static async create(userData) {
//         const collection = getUserCollection();
//         const existingUser = await collection.findOne({ email: userData.email });
//         if (existingUser) {
//             throw new DuplicateEmailError();
//         }

//         const user = {
//             ...userData,
//             createdAt: new Date()
//         };
//         const result = await collection.insertOne(user);
//         return { _id: result.insertedId, ...user };
//     }

//     static async update(id, updateData) {
//         try {
//             if (!ObjectId.isValid(id)) {
//                 throw new UserNotFoundError('Invalid user ID format');
//             }
    
//             const collection = getUserCollection();
//             const objectId = new ObjectId(id);
            
//             const existingUser = await collection.findOne({ _id: objectId });
//             if (!existingUser) {
//                 throw new UserNotFoundError(`No user found with id: ${id}`);
//             }
//             if (updateData.email && updateData.email !== existingUser.email) {
//                 const duplicateEmail = await collection.findOne({ 
//                     email: updateData.email,
//                     _id: { $ne: objectId }
//                 });
//                 if (duplicateEmail) {
//                     throw new DuplicateEmailError();
//                 }
//             }
    
//             const result = await collection.findOneAndUpdate(
//                 { _id: objectId },
//                 { 
//                     $set: {
//                         ...updateData,
//                         updatedAt: new Date()
//                     }
//                 },
//                 { 
//                     returnDocument: 'after'
//                 }
//             );
    
//             return result.value;
//         } catch (error) {
//             throw error;
//         }
//     }

//     static async delete(id) {
//         const collection = getUserCollection();
//         const result = await collection.deleteOne({ _id: new ObjectId(id) });
        
//         if (result.deletedCount === 0) {
//             throw new UserNotFoundError();
//         }

//         return result;
//     }
// }

// module.exports = User;

const { ObjectId } = require('mongodb');
const { getDb } = require('../database/connect');
const bcrypt = require('bcryptjs');
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

    static async findByGitHubId(githubId) {
        const collection = getUserCollection();
        const user = await collection.findOne({ githubId });
        if (!user) {
            throw new UserNotFoundError(`No user found with GitHub ID: ${githubId}`);
        }
        return user;
    }

    static async create(userData) {
        const collection = getUserCollection();
        const existingUser = await collection.findOne({ email: userData.email });
        if (existingUser) {
            throw new DuplicateEmailError();
        }

        if (userData.password) {
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);
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
        const objectId = new ObjectId(id);

        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        const result = await collection.findOneAndUpdate(
            { _id: objectId },
            { $set: { ...updateData, updatedAt: new Date() } },
            { returnDocument: 'after' }
        );

        if (!result.value) {
            throw new UserNotFoundError(`No user found with id: ${id}`);
        }

        return result.value;
    }

    static async delete(id) {
        const collection = getUserCollection();
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            throw new UserNotFoundError(`No user found with id: ${id}`);
        }

        return result;
    }
}

module.exports = User;
