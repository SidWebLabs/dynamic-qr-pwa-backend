const jwt = require("jsonwebtoken");

module.exports = (...roles) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return res.status(401).json({
                    success: false,
                    message: "Token required",
                });
            }

            const token = authHeader.split(" ")[1];

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            if (
                roles.length &&
                !roles.includes(decoded.role)
            ) {
                return res.status(403).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            req.user = decoded;

            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }
    };
};