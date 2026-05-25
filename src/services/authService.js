const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserMaster = require("../models/UserMaster");
const logger = require("nirmitee-logger");
const { response } = require("../app");
const { is_active } = require("../utils/commonFields");

exports.registerUser = async (payload, options) => {
    const { name, mobile_no, pin } = payload;
    const { transaction } = options;

    const existingUser = await UserMaster.findOne({
        where: {
            mobile_no,
            is_active: true,
        },
    });

    if (existingUser) {
        logger.warn("User already exists", { mobile_no });
        return res.status(400).json({
            success: false,
            message: "User already exists",
        });
    }

    const user = await UserMaster.create({
        name,
        mobile_no,
        pin,
        is_active: true,
    },
        { transaction });

    await transaction.commit();
    logger.info("User created successfully", { user_id: user?.id, mobile_no: user?.mobile_no });
    return user;
};

exports.loginUser = async (payload) => {
    const { mobile_no, pin } = payload;

    const user = await UserMaster.findOne({
        where: {
            mobile_no,
            is_active: true,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const isValidPin = await bcrypt.compare(
        pin,
        user.pin
    );

    if (!isValidPin) {
        throw new Error("Invalid PIN");
    }

    const token = jwt.sign(
        {
            user_id: user.user_id,
            mobile_no: user.mobile_no,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "30d",
        }
    );

    return {
        user,
        token,
    };
};