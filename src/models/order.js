'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsToMany(models.Product, { through: 'OrderDetail', foreignKey: 'order_id ', otherKey: 'product_id', as: 'Product' })
      Order.belongsTo(models.User, { foreignKey: 'user_id' })
      Order.belongsTo(models.Payment, { foreignKey: 'payment_id' })
      Order.hasMany(models.OrderDetail, {
        foreignKey: "order_id",
        onDelete: 'CASCADE',
      });
    }
  }
  Order.init({
    user_id: DataTypes.INTEGER,
    payment_id: DataTypes.INTEGER,
    name_receive: DataTypes.STRING,
    phone_receive: DataTypes.STRING,
    address: DataTypes.STRING,
    email: DataTypes.STRING,
    total_price: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM,
      values: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned', 'failed'],
      defaultValue: 'pending',
      allowNull: false
    },

  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};