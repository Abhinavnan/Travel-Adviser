class httpError extends Error {
  constructor(message, errorCode) {
    super(message); // Add a message property
    this.code = errorCode; // Add a code property
  }
}

module.exports = httpError; //export the class