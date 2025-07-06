const { Sequelize } = require('sequelize');
require('dotenv').config();
// Initialize Sequelize with environment variables

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // optional
  }
);

module.exports = sequelize;
