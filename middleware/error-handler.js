/**
 * Error handling middleware for Express.js applications.
 *
 * This middleware captures errors thrown during request processing and returns
 * a structured JSON response with an appropriate HTTP status code and error message.
 * @version 1.0
 */

const { StatusCodes } = require('http-status-codes');


const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  };

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',');
    customError.statusCode = 400;
  }

  // MongoDB Duplicate Key Error
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
    customError.statusCode = 400;
  }

  // Mongoose Cast Error
  if (err.name === 'CastError') {
    customError.msg = `No item found with id: ${err.value}`;
    customError.statusCode = 404;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};


module.exports = errorHandlerMiddleware;