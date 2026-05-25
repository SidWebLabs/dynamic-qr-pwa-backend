const jwt = require("jsonwebtoken");

const UserMaster = require("../models/UserMaster");
const logger = require("nirmitee-logger");

exports.registerUser = async (
    payload,
    options
) => {
    const { name, mobile_no, pin } = payload;

    const { transaction } = options;

    const existingUser =
        await UserMaster.findOne({
            where: {
                mobile_no,
                is_active: true,
            },
        });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const user = await UserMaster.create(
        {
            name,
            mobile_no,
            pin,
            is_active: true,
        },
        {
            transaction,
        }
    );

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
        logger.error("User not found", { mobile_no });
        throw new Error("User not found");
    }

    let userPin = parseInt(user?.pin);

    if (userPin !== parseInt(pin)) {
        logger.error("Invalid PIN", { mobile_no });
        throw new Error("Invalid PIN");
    }

    const token = jwt.sign(
        {
            user_id: user?.id,
            mobile_no: user?.mobile_no
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