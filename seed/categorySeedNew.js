const sequelize = require('../config/connection');
const { Category } = require('../models');

const categorySeedData = require('./categorySeedData.json');

const seedCategories = () => Category.bulkCreate(categorySeedData);

seedCategories();
