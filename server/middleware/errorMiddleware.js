const { sendError } = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  console.error("Express Error:", err.stack || err.message);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal Server Error";

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    message = "Resource not found with the given ID";
    statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    message = "Duplicate field value entered";
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    statusCode = 400;
  }

  return sendError(res, message, statusCode, err);
};

module.exports = { errorHandler };
