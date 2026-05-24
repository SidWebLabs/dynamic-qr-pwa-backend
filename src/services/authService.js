const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserMaster = require("../models/UserMaster");

exports.registerUser = async (payload) => {
    const { name, mobile_no, pin } = payload;

    const existingUser = await UserMaster.findOne({
        where: {
            mobile_no,
            is_active: true,
        },
    });

    if (existingUser) {
        throw new Error("User already exists");
    }

    // const hashedPin = await bcrypt.hash(pin, 10);

    const user = await UserMaster.create({
        name,
        mobile_no,
        pin
        });

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