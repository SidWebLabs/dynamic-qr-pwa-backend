const USER_ROLES = {
    ADMIN: "admin",
    USER: "user"
};

const CONSTANTS = {
    REGEX_MOBILE_NO: /^[0-9]{10}$/,
    REGEX_PIN: /^[0-9]{5}$/,
    REGEX_UPI_ID: /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/,

    /** Split payment: amount > 2000 AND amount < 5000 → 3 QRs, each ≤ 2000 */
    SPLIT_MIN_EXCLUSIVE: 2000,
    SPLIT_MAX_EXCLUSIVE: 5000,
    SPLIT_PARTS: 3,
    SPLIT_MAX_PER_PART: 2000,
}

module.exports = { USER_ROLES, CONSTANTS };