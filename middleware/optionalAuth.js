const jwt = require('jsonwebtoken');
const User = require('../models/User');

const optionalAuth = async (req, res, next) => {
    const { logintoken } = req.cookies;

    try {
        const data = jwt.verify(logintoken, process.env.JWT_KEY);
        const { id } = data;

        const user = await User.findOne({
            where: {
                username: id,
            },
        });
        if (!user) {
            throw new Error(
                'Could not authorize user. Proceeding without Authentication'
            );
        }

        req.user = user;
        next();
    } catch (error) {
        req.user = null;
        console.log(error);
        next();
    }
};

module.exports = optionalAuth;
