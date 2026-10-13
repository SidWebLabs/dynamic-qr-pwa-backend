const { Op } = require("sequelize");
const logger = require("nirmitee-logger");

const UserAccountMaster = require("../models/UserAccountMaster");
const UserSplitPaymentMaster = require("../models/UserSplitPaymentMaster");
const UserSplitPaymentItemMaster = require("../models/UserSplitPaymentItemMaster");
const { splitAmountRandomly, shouldSplitAmount } = require("../utils/splitAmount");
const { CONSTANTS } = require("../lib/constant");

exports.createSplitPayment = async (payload, options) => {
    const { user_id, account_id, amount, note } = payload;
    const { transaction } = options;

    if (!shouldSplitAmount(amount)) {
        throw new Error(
            `Split payment is only allowed for amounts above ₹${CONSTANTS.SPLIT_MIN_EXCLUSIVE} and below ₹${CONSTANTS.SPLIT_MAX_EXCLUSIVE}`
        );
    }

    const account = await UserAccountMaster.findOne({
        where: { id: account_id, user_id, is_active: true },
        transaction,
    });

    if (!account) {
        logger.error({ message: "UPI account not found for split", user_id, account_id });
        throw new Error("UPI account not found");
    }

    const parts = splitAmountRandomly(amount);
    const noteText = note?.trim() || null;

    const parent = await UserSplitPaymentMaster.create(
        {
            user_id,
            account_id,
            owner_name: account.owner_name,
            owner_upi_id: account.owner_upi_id,
            total_amount: Number(amount),
            note: noteText,
            split_count: parts.length,
            is_active: true,
            created_by: user_id,
        },
        { transaction }
    );

    const items = [];
    for (let i = 0; i < parts.length; i++) {
        const item = await UserSplitPaymentItemMaster.create(
            {
                split_payment_id: parent.id,
                sequence_no: i + 1,
                amount: parts[i],
                note: noteText
                    ? `${noteText} (Part ${i + 1}/${parts.length})`
                    : `Split part ${i + 1}/${parts.length}`,
                is_active: true,
                created_by: user_id,
            },
            { transaction }
        );
        items.push(item);
    }

    logger.info({
        message: "Split payment recorded",
        user_id,
        account_id,
        total_amount: amount,
        parts,
        split_payment_id: parent.id,
    });

    return {
        ...parent.toJSON(),
        items: items.map((item) => item.toJSON()),
    };
};

exports.getSplitPayments = async (user_id, filters = {}) => {
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

    const records = await UserSplitPaymentMaster.findAll({
        where,
        include: [
            {
                model: UserSplitPaymentItemMaster,
                as: "items",
                where: { is_active: true },
                required: false,
            },
        ],
        order: [
            ["created_on", "DESC"],
            [{ model: UserSplitPaymentItemMaster, as: "items" }, "sequence_no", "ASC"],
        ],
    });

    return records;
};

exports.deleteSplitPayment = async (id, user_id, options) => {
    const { transaction } = options;

    const record = await UserSplitPaymentMaster.findOne({
        where: { id, user_id, is_active: true },
        transaction,
    });

    if (!record) {
        logger.error({ message: "Split payment not found", id, user_id });
        throw new Error("Split payment not found");
    }

    await record.update(
        { is_active: false, modified_by: user_id },
        { transaction }
    );

    await UserSplitPaymentItemMaster.update(
        { is_active: false, modified_by: user_id },
        { where: { split_payment_id: id }, transaction }
    );

    logger.info({ message: "Split payment deleted", id, user_id });

    return { success: true };
};
