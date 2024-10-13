const { Sequelize } = require('sequelize');
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    'sql12737410',
    'sql12737410',
    'diBqnA84cH',
    {
        host: 'sql12.freemysqlhosting.net',
        port: 3306,
        dialect: 'mysql'
    }
);


const connection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}


export default connection;

