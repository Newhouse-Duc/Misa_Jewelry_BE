'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      User.hasMany(models.Order, { foreignKey: 'user_id' })


    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    username: DataTypes.STRING,
    role: DataTypes.STRING,
    phone: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM,
      values: ['active', 'inactive'],
      defaultValue: 'active',
      allowNull: false
    },

  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};