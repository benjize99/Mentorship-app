const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Request = sequelize.define('Request', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  menteeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  mentorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    defaultValue: 'pending',
  },
});

// ✅ Associations should be added outside of the define() call
Request.associate = (models) => {
  Request.belongsTo(models.User, { as: 'mentor', foreignKey: 'mentorId' });
  Request.belongsTo(models.User, { as: 'mentee', foreignKey: 'menteeId' });
};

module.exports = Request;
