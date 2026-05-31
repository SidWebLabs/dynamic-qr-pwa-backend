const UserAccountMaster = require("../models/UserAccountMaster");
const UserMaster = require("../models/UserMaster");
const logger = require("nirmitee-logger");

exports.getAccounts = async (user_id) => {
    const accounts = await UserAccountMaster.findAll({
        where: { user_id, is_active: true },
        order: [["is_primary", "DESC"], ["created_on", "ASC"]],
    });
    return accounts;
};

exports.createAccount = async (payload, options) => {
    const { user_id, owner_name, owner_upi_id } = payload;
    const { transaction } = options;

    // Fetch user to check limit
    const user = await UserMaster.findOne({
        where: { id: user_id, is_active: true },
    });

    if (!user) {
        throw new Error("User not found");
    }

    // Count existing active accounts
    const accountCount = await UserAccountMaster.count({
        where: { user_id, is_active: true },
    });

    if (accountCount >= user.max_account_limit) {
        logger.error({ message: "Account limit reached", user_id, limit: user.max_account_limit });
        throw new Error(
            `Account limit reached. You can only add up to ${user.max_account_limit} UPI accounts.`
        );
    }

    // Check duplicate UPI ID
    const existing = await UserAccountMaster.findOne({
        where: { owner_upi_id: owner_upi_id.trim(), is_active: true },
    });

    if (existing) {
        throw new Error("This UPI ID is already registered.");
    }

    // First account → set as primary
    const is_primary = accountCount === 0;

    const account = await UserAccountMaster.create(
        {
            user_id,
            owner_name: owner_name.trim(),
            owner_upi_id: owner_upi_id.trim(),
            is_primary,
            is_active: true,
            created_by: user_id,
        },
        { transaction }
    );

    logger.info({ message: "Account created", user_id, owner_upi_id });
    return account;
};

exports.updateAccount = async (id, user_id, payload, options) => {
    const { owner_name, owner_upi_id } = payload;
    const { transaction } = options;

    const account = await UserAccountMaster.findOne({
        where: { id, user_id, is_active: true },
    });

    if (!account) {
        throw new Error("Account not found");
    }

    // Check duplicate UPI ID (exclude self)
    if (owner_upi_id && owner_upi_id.trim() !== account.owner_upi_id) {
        const duplicate = await UserAccountMaster.findOne({
            where: { owner_upi_id: owner_upi_id.trim(), is_active: true },
        });
        if (duplicate) throw new Error("This UPI ID is already registered.");
    }

    await account.update(
        {
            owner_name: owner_name?.trim() ?? account.owner_name,
            owner_upi_id: owner_upi_id?.trim() ?? account.owner_upi_id,
            modified_by: user_id,
        },
        { transaction }
    );

    logger.info({ message: "Account updated", id, user_id });
    return account;
};

exports.deleteAccount = async (id, user_id, options) => {
    const { transaction } = options;

    const account = await UserAccountMaster.findOne({
        where: { id, user_id, is_active: true },
    });

    if (!account) {
        throw new Error("Account not found");
    }

    await account.update(
        { is_active: false, modified_by: user_id },
        { transaction }
    );

    // If deleted account was primary, promote the next one
    if (account.is_primary) {
        const next = await UserAccountMaster.findOne({
            where: { user_id, is_active: true },
            order: [["created_on", "ASC"]],
        });
        if (next) {
            await next.update({ is_primary: true, modified_by: user_id }, { transaction });
        }
    }

    logger.info({ message: "Account deleted", id, user_id });
    return { success: true };
};

exports.setPrimary = async (id, user_id, options) => {
    const { transaction } = options;

    const account = await UserAccountMaster.findOne({
        where: { id, user_id, is_active: true },
    });

    if (!account) throw new Error("Account not found");

    // Unset all primaries for this user
    await UserAccountMaster.update(
        { is_primary: false, modified_by: user_id },
        { where: { user_id, is_active: true }, transaction }
    );

    // Set new primary
    await account.update({ is_primary: true, modified_by: user_id }, { transaction });

    logger.info({ message: "Primary account set", id, user_id });
    return account;
};