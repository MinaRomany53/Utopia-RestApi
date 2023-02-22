class ApiErrors extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "Fail" : "Error"; // (4xx => Fail) - (5xx => Error)
    this.isOperational = true; // Operational Errors => Problems that we can predict will happen at some point, so we just need to handle them in advance.
  }
}

module.exports = ApiErrors;
