const sequelize = require("../config/database");
const authService = require("../services/authService");
const logger = require("nirmitee-logger");

exports.register = async (req, res) => {
    let transaction = await sequelize.transaction({ autocommit: false });
    try {
        const user = await authService.registerUser(
            req.body,
            { transaction }
        );

        if (!user) {
            await transaction.rollback();
            logger.error("User registration failed", { mobile_no: req.body.mobile_no });
            return res.status(500).json({
                success: false,
                message: "User registration failed",
            });
        }

        logger.info("User registered successfully", {
            id: user.id,
            mobile_no: user.mobile_no,
        });

        await transaction.commit();

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user,
        });
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
    finally {
        await transaction.cleanup();
    }
};

exports.login = async (req, res) => {
    let transaction = await sequelize.transaction({ autocommit: false });
    try {
        const data = await authService.loginUser(
            req.body
        );

        await transaction.commit();
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data,
        });
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    } finally {
        await transaction.cleanup();
    }
};