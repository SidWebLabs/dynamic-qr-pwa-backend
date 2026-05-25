const joi = require("joi");

const { CONSTANTS } = require("../lib/constant");

const joiValidation = {
    register: joi.object({
        name: joi.string().min(2).max(100).required(),

        mobile_no: joi
            .string()
            .pattern(CONSTANTS.REGEX_MOBILE_NO)
            .required(),

        pin: joi
            .string()
            .pattern(CONSTANTS.REGEX_PIN)
            .required(),
    }),

    login: joi.object({
        mobile_no: joi
            .string()
            .pattern(CONSTANTS.REGEX_MOBILE_NO)
            .required(),

        pin: joi
            .string()
            .pattern(CONSTANTS.REGEX_PIN)
            .required(),
    }),
};

module.exports = joiValidation;