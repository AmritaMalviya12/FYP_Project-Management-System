class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "internal server error";
  err.statusCode = err.statusCode || 500;

  if (err.code == 11000) {
    const message = `duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name == "JsonWebTokenError") {
    const message = `Json web token is invalid, please try again`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name == "TokenExpiredError") {
    const message = `Json web token is expired, please try again`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name == "CastError") {
    const message = `Resource not found ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((value) => value.message)
        .join(", ")
    : err.message;


    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage,
    });
};

export default ErrorHandler;