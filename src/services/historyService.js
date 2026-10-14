const { Op } = require("sequelize");
const UserQrHistoryMaster = require("../models/UserQrHistoryMaster");
const UserAccountMaster = require("../models/UserAccountMaster");
const logger = require("nirmitee-logger");

exports.createHistory = async (payload, options) => {
    const { user_id, account_id, amount, note } = payload;
    const { transaction } = options;

    const account = await UserAccountMaster.findOne({
        where: { id: account_id, user_id, is_active: true },
    });

    if (!account) {
        logger.error({ message: "UPI account not found", user_id, account_id });
        throw new Error("UPI account not found");
    }

    const record = await UserQrHistoryMaster.create(
        {
            user_id,
            account_id,
            owner_name: account.owner_name,
            owner_upi_id: account.owner_upi_id,
            amount,
            note: note?.trim() || null,
            is_active: true,
            created_by: user_id,
        },
        { transaction }
    );

    logger.info({ message: "QR history recorded", user_id, account_id, amount });

    return record;
};

exports.getHistory = async (user_id, filters = {}) => {
    const { filter, date } = filters;

    const where = { user_id, is_active: true };

    if (filter === "today") {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        where.created_on = { [Op.between]: [start, end] };
    } else if (filter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        where.created_on = { [Op.gte]: weekAgo };
    } else if (filter === "custom" && date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        where.created_on = { [Op.between]: [start, end] };
    }

    const records = await UserQrHistoryMaster.findAll({
        where,
        order: [["created_on", "DESC"]],
    });

    return records;
};

exports.deleteHistory = async (id, user_id, options) => {
    const { transaction } = options;

    const record = await UserQrHistoryMaster.findOne({
        where: { id, user_id, is_active: true },
    });

    if (!record) {
        logger.error({ message: "History record not found", id, user_id });
        throw new Error("History record not found");
    }

    await record.update(
        { is_active: false, modified_by: user_id },
        { transaction }
    );

    logger.info({ message: "QR history record deleted", id, user_id });

    return { success: true };
};