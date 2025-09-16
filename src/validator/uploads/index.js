const { ImageHeadersSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const UploadsValidator = {
    validateImageHeaders: (headers) => {
        console.log('ImageHeadersSchema:', ImageHeadersSchema);
        const validationResult = ImageHeadersSchema.validate(headers);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = UploadsValidator;
