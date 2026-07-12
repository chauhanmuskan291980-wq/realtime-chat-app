export const errorHandler = (
  error,
  req,
  res,
  next
) => {
  console.error(error.stack || error);

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Internal server error"
        : error.message,
  });
};