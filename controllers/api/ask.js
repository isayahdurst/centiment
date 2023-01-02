const { Router } = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer({ dest: './public/data/uploads/' });
const fs = require('fs');
const auth = require('../../middleware/auth');
const { Op } = require('sequelize');

const { Ask } = require('./../../models');

const askRouter = new Router();

askRouter.get('/:topic_id', async (req, res) => {});

module.exports = askRouter;
