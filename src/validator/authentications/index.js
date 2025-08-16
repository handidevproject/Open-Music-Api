const {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
} = require("./schema");

const InvariantError = require("../../exceptions/InvariantError");

const AuthenticationsValidator = {
  validatePostAuthenticationPayload: (request, h) => {
    const validationResult = PostAuthenticationPayloadSchema.validate(request);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutAuthenticationPayload: (request, h) => {
    const validationResult = PutAuthenticationPayloadSchema.validate(request);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteAuthenticationPayload: (request, h) => {
    const validationResult =
      DeleteAuthenticationPayloadSchema.validate(request);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
module.exports = AuthenticationsValidator;
