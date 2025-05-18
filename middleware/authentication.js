/**
 * Authentication middleware for protected routes.
 * 
 * Checks for a valid JWT token in the Authorization header (HTTP-Header).
 * If valid, attaches the user's ID and name to the request object (req.user).
 * If missing or invalid, throws an UnauthenticatedError.
 * @version 1.0
 */

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');


/**
 * Middleware to authenticate requests using a JWT from the Authorization header.
 *
 * Verifies the token and attaches the user payload to `req.user`.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @throws {UnauthenticatedError} If the token is missing, malformed, or invalid.
 */
const auth = async (req, res, next) => {
  // check header / token is in req.headers
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication invalid');
  }
  // take the token on the second position
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach the user to the job routes
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid');
  }
};


module.exports = auth;