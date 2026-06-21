const sequelize = require("../config/database");
const historyService = require("../services/historyService");
const logger = require("nirmitee-logger");

exports.createHistory = async (req, res) => {
    let transaction = await sequelize.transaction({ autocommit: false });
    try {
        const user_id = req.user.user_id;
        const record = await historyService.createHistory(
            { ...req.body, user_id },
            { transaction }
        );

        await transaction.commit();
        return res.status(201).json({
            success: true,
            message: "QR history saved",
            data: record,
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

exports.getHistory = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { filter, date } = req.query;

        const records = await historyService.getHistory(user_id, { filter, date });

        return res.status(200).json({
            success: true,
            message: "History fetched successfully",
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

exports.deleteHistory = async (req, res) => {
    let transaction = await sequelize.transaction({ autocommit: false });
    try {
        const user_id = req.user.user_id;
        const { id } = req.params;

        await historyService.deleteHistory(id, user_id, { transaction });

        await transaction.commit();
        return res.status(200).json({
            success: true,
            message: "History record deleted",
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