'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category, { foreignKey: 'categoryid' })
      Product.belongsToMany(models.Order, { through: 'OrderDetail', foreignKey: 'product_id', otherKey: 'order_id', as: 'Order' })
      Product.hasMany(models.OrderDetail, {
        foreignKey: 'product_id',

      });
    }
  }
  Product.init({
    productName: DataTypes.STRING,
    img: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.STRING,
    categoryid: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};