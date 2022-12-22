require("dotenv").config();
const path = require('path');
const bcrypt = require('bcrypt');
const express = require("express");
const sequelize = require("./config/connection");
const mainRouter = require("./controllers");
const cookieParser = require("cookie-parser");
const { engine } = require("express-handlebars");
const PORT = process.env.PORT || 3001;

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(cookieParser());
app.use(mainRouter);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Application is running on port ${PORT}`);
  })
})