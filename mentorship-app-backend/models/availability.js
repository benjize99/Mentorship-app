const { Model, DataTypes } = require('sequelize');

class Availability extends Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      day: {
        type: DataTypes.STRING, // e.g., 'Monday', or could be ENUM
        allowNull: false,
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'Availability',
      tableName: 'availabilities',  // match your DB table name
      timestamps: true,             // createdAt and updatedAt
    });
  }

  static associate(models) {
    // Availability belongs to User
    Availability.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

module.exports = Availability;
