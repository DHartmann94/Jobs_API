/**
 * Mongoose schema and model for User documents.
 *
 * Fields:
 * - name: User's name (required, 3-50 characters).
 * - email: User's email (required, unique, valid email format).
 * - password: User's hashed password (required, min 6 characters).
 *
 * Features:
 * - Password hashing before saving using bcrypt.
 * - Instance method `createJWT` to generate a JWT token.
 * - Instance method `comparePassword` to verify a password against the hashed one.
 *
 * Automatically manages `createdAt` and `updatedAt` timestamps.
 * @version 1.0
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        maxlength: 50,
        minlength: 3,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
    },
}, { timestamps: true });
// When using bcrypt, the password is hashed and you can't perform a regex check here

//hashed password
//mongoose middleware
UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//JWT-Token
UserSchema.methods.createJWT = function () {
    return jwt.sign(
        { userId: this._id, name: this.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME }
    );
};

UserSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password);
    return isMatch;
};


module.exports = mongoose.model('User', UserSchema);