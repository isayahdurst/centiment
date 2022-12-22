const jwt = require("jsonwebtoken");

const User = require("../models/User");

module.exports = async (req, res, next) => {
  const { logintoken } = req.cookies;

  try {
    const data = jwt.verify(logintoken, process.env.JWT_KEY);
    const { id } = data;
    
    const user = await User.findOne({ where: 
      {
          username: id
      }
    });
    if (!user) {
      res.redirect("/login");
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    if (
      error.message === "invalid token" ||
      error.message === "jwt must be provided"
    ) {
      res.redirect("/login");
    } else {
      console.error(error);
      res.status(500).end("Server Error");
    }
  }
};
