const USER_ROLES = {
    ADMIN: "admin",
    USER: "user"
};

const CONSTANTS = {
    REGEX_MOBILE_NO: /^[0-9]{10}$/,
    REGEX_PIN: /^[0-9]{5}$/,
    REGEX_UPI_ID: /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/,
}

module.exports = { USER_ROLES, CONSTANTS };