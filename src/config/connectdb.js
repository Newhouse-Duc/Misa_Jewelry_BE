const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(
    'sql12737294',
    'sql12737294',
    'w5abIUAa39',
    {
        host: 'sql12.freemysqlhosting.net',
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

