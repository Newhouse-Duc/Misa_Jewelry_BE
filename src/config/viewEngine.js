import express from 'express';
const path = require('path');
/**
 * 
 * @param {*} app 
 */


const configViewEngine = (app) => {

    app.use('/uploads', express.static(path.join('./src/uploads')));
    app.set("view engine", "ejs");
    app.set("views", "./src/views")
}


export default configViewEngine