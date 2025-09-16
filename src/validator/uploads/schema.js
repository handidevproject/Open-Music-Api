const Joi = require('joi');

const ImageHeadersSchema = Joi.object({
    'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/jpeg', 'image/png', 'image/webp').required(),
}).unknown(); // unknown supaya header lain tidak dianggap error

module.exports = { ImageHeadersSchema };
