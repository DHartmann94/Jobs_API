/**
 * Auth controller handling user registration and login.
 *
 * - `register`: Creates a new user and returns a JWT.
 * - `login`: Authenticates a user and returns a JWT.
 *
 * Uses custom errors and HTTP status codes for responses.
 * @version 1.0
 */

const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');


/**
 * Registers a new user and returns a JWT token.
 *
 * @param {Object} req - Express request object containing user data in the body.
 * @param {Object} res - Express response object used to send the response.
 */
const register = async (req, res) => {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();

    res.status(StatusCodes.CREATED).json(
        { user: { name: user.name, email: user.email }, token }
    );
};

/**
 * Logs in a user by validating credentials and returns a JWT token.
 *
 * @param {Object} req - Express request object containing email and password in the body.
 * @param {Object} res - Express response object used to send the response.
 *
 * @throws {BadRequestError} If email or password is missing.
 * @throws {UnauthenticatedError} If credentials are invalid.
 */
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials');
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json(
        { user: { name: user.name }, token }
    );
};


module.exports = {
    register,
    login
};