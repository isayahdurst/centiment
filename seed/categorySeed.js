const { Category } = require('../models');

const categoryData = [
  {
    category_name: 'Clothing',
  },
  {
    category_name: 'Shoes',
  },
  {
    category_name: 'Music',
  },
  {
    category_name: 'Sports',
  },
  {
    category_name: 'Finance',
  },
];

const seedCategories = () => Category.bulkCreate(categoryData);

module.exports = seedCategories;

