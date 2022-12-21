require("dotenv").config();
const express = require("express");
const app = express();
// const { engine } = require('express-handlebars');
const PORT = process.env.PORT || 3001;

const sequalize = require('./config/connection');
// const mainRouter = require("./controllers");

// app.engine('handlebars', engine());
// app.set('view engine', 'handlebars');

app.use(express.json());
// app.use(mainRouter);

// sequalize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Application is running on port ${PORT}`);
  })
// })