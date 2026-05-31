const sequelize = require("../config/database");
const accountService = require("../services/accountService");
const logger = require("nirmitee-logger");

exports.getAccounts = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const accounts = await accountService.getAccounts(user_id);
        return res.status(200).json({
            success: true,
            message: "Accounts fetched successfully",
            data: accounts,
        });
    } catch (error) {
        logger.error({ message: error.message });
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.createAccount = async (req, res) => {
    let transaction = await sequelize.transaction({ autocommit: false });
    try {
        const user_id = req.user.user_id;
        const account = await accountService.createAccount(
            { ...req.body, user_id },
            { transaction }
        );

        await transaction.commit();
        return res.status(201).json({
            success: true,
            message: "UPI account added successfully",
            data: account,
        });
    } catch (error) {
        await transaction.rollback();
        logger.error({ message: error.message });
        const status = error.message.includes("limit") || error.message.includes("already") ? 400 : 500;
        return res.status(status).json({ success: false, message: error.message });
    } finally {
        await transaction.cleanup();
    }
};

exports.updateAccount = async (req, res) => {
    let transaction = await sequelize.transaction({ autocommit: false });
    try {
        const user_id = req.user.user_id;
        const { id } = req.params;

        const account = await accountService.updateAccount(
            id, user_id, req.body, { transaction }
        );

        await transaction.commit();
        return res.status(200).json({
            success: true,
            message: "UPI account updated successfully",
            data: account,
        });
    } catch (error) {
        await transaction.rollback();
        logger.error({ message: error.message });
        const status = error.message.includes("not found") ? 404 : 500;
        return res.status(status).json({ success: false, message: error.message });
    } finally {
        await transaction.cleanup();
    }
};

exports.deleteAccount = async (req, res) => {
    let transaction = await sequelize.transaction({ autocommit: false });
    try {
        const user_id = req.user.user_id;
        const { id } = req.params;

        await accountService.deleteAccount(id, user_id, { transaction });

        await transaction.commit();
        return res.status(200).json({
            success: true,
            message: "UPI account removed successfully",
        });
    } catch (error) {
        await transaction.rollback();
        logger.error({ message: error.message });
        const status = error.message.includes("not found") ? 404 : 500;
        return res.status(status).json({ success: false, message: error.message });
    } finally {
        await transaction.cleanup();
    }
};

exports.setPrimary = async (req, res) => {
    let transaction = await sequelize.transaction({ autocommit: false });
    try {
        const user_id = req.user.user_id;
        const { id } = req.params;

        const account = await accountService.setPrimary(id, user_id, { transaction });

        await transaction.commit();
        return res.status(200).json({
            success: true,
            message: "Primary account updated",
            data: account,
        });
    } catch (error) {
        await transaction.rollback();
        logger.error({ message: error.message });
        const status = error.message.includes("not found") ? 404 : 500;
        return res.status(status).json({ success: false, message: error.message });
    } finally {
        await transaction.cleanup();
    }
};