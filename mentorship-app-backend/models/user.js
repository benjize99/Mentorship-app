const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
//User.hasMany(Availability, { foreignKey: 'userId' });

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('mentee', 'mentor', 'admin'),
    defaultValue: 'mentee', // Default role is 'mentee'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
   bio: {
    type: DataTypes.TEXT, // Use TEXT to allow longer bios
    allowNull: true,
  },
  skills: {
    type: DataTypes.JSON, // Store skills as JSON array
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true, // or false if image is required
  },
}, {
  timestamps: true,
  tableName: 'users', 
});

module.exports = User;
