const joi = require("joi");

const { CONSTANTS } = require("../lib/constant");

const joiValidation = {
    register: joi.object({
        name: joi.string().min(2).max(100).required().messages({
            "string.min": "Name must be at least 2 characters",
            "string.max": "Name must be at most 100 characters",
            "any.required": "Name is required",
        }),

        mobile_no: joi
            .string()
            .pattern(CONSTANTS.REGEX_MOBILE_NO)
            .required()
            .messages({
                "string.pattern.base": "Enter a valid 10-digit mobile number",
                "any.required": "Mobile number is required",
            }),

        pin: joi
            .string()
            .pattern(CONSTANTS.REGEX_PIN)
            .required()
            .messages({
                "string.pattern.base": "PIN must be exactly 5 digits",
                "any.required": "PIN is required",
            }),
    }),

    login: joi.object({
        mobile_no: joi
            .string()
            .pattern(CONSTANTS.REGEX_MOBILE_NO)
            .required()
            .messages({
                "string.pattern.base": "Enter a valid 10-digit mobile number",
                "any.required": "Mobile number is required",
            }),

        pin: joi
            .string()
            .pattern(CONSTANTS.REGEX_PIN)
            .required()
            .messages({
                "string.pattern.base": "PIN must be exactly 5 digits",
                "any.required": "PIN is required",
            }),
    }),

    createAccount: joi.object({
        owner_name: joi
            .string()
            .min(2)
            .max(100)
            .required()
            .messages({
                "string.min": "Owner name must be at least 2 characters",
                "string.max": "Owner name must be at most 100 characters",
                "any.required": "Owner name is required",
            }),

        owner_upi_id: joi
            .string()
            .pattern(CONSTANTS.REGEX_UPI_ID)
            .required()
            .messages({
                "string.pattern.base": "Invalid UPI ID format (e.g. name@upi, 9876543210@oksbi)",
                "any.required": "UPI ID is required",
            }),
    }),

    updateAccount: joi
        .object({
            owner_name: joi
                .string()
                .min(2)
                .max(100)
                .messages({
                    "string.min": "Owner name must be at least 2 characters",
                    "string.max": "Owner name must be at most 100 characters",
                }),

            owner_upi_id: joi
                .string()
                .pattern(CONSTANTS.REGEX_UPI_ID)
                .messages({
                    "string.pattern.base": "Invalid UPI ID format (e.g. name@upi, 9876543210@oksbi)",
                }),
        })
        .min(1)
        .messages({
            "object.min": "Provide at least one field to update",
        }),


    createHistory: joi.object({
        account_id: joi
            .number()
            .integer()
            .positive()
            .required()
            .messages({
                "number.base": "Account ID is required",
                "any.required": "Account ID is required",
            }),

        amount: joi
            .number()
            .positive()
            .precision(2)
            .required()
            .messages({
                "number.base": "Amount must be a valid number",
                "number.positive": "Amount must be greater than 0",
                "any.required": "Amount is required",
            }),

        note: joi
            .string()
            .max(255)
            .allow("", null)
            .messages({
                "string.max": "Note must be at most 255 characters",
            }),
    }),
};

module.exports = joiValidation;