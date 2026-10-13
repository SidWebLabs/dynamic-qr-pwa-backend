const sequelize = require("../config/database");
const splitPaymentService = require("../services/splitPaymentService");
const logger = require("nirmitee-logger");

exports.createSplitPayment = async (req, res) => {
    let transaction = await sequelize.transaction({ autocommit: false });
    try {
        const user_id = req.user.user_id;
        const record = await splitPaymentService.createSplitPayment(
            { ...req.body, user_id },
            { transaction }
        );

        await transaction.commit();
        return res.status(201).json({
            success: true,
            message: "Split payment QR history saved",
            data: record,
        });
    } catch (error) {
        await transaction.rollback();
        logger.error({ message: error.message });
        const status = error.message.includes("only allowed") ? 400 : 500;
        return res.status(status).json({
            success: false,
            message: error.message,
        });
    } finally {
        await transaction.cleanup();
    }
};

exports.getSplitPayments = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { filter, date } = req.query;

        const records = await splitPaymentService.getSplitPayments(user_id, {
            filter,
            date,
        });

        return res.status(200).json({
            success: true,
            message: "Split payments fetched successfully",
            data: records,
        });
    } catch (error) {
        logger.error({ message: error.message });
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.deleteSplitPayment = async (req, res) => {
    let transaction = await sequelize.transaction({ autocommit: false });
    try {
        const user_id = req.user.user_id;
        const { id } = req.params;

        await splitPaymentService.deleteSplitPayment(id, user_id, { transaction });

        await transaction.commit();
        return res.status(200).json({
            success: true,
            message: "Split payment deleted",
        });
    } catch (error) {
        await transaction.rollback();
        logger.error({ message: error.message });
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    } finally {
        await transaction.cleanup();
    }
};
