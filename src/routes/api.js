
import express from 'express';

import apiController from '../controller/apiController';
import { CheckJWT } from '../middleware/jwtmiddleware.js';
const router = express.Router();
/**
 * 
 * @param {*} app : express app
 */


const initapiRoute = (app) => {



    router.post("/register", apiController.handleRegister)
    router.post("/login", apiController.handleLogin)


    router.get("/show/payment", apiController.handlegetPaymentmethod)


    router.post("/order/payment", CheckJWT, apiController.handleOrderpay)
    router.post('/ipn', apiController.handleIPN);


    router.post("/order", CheckJWT, apiController.handleOrder)
    router.get("/user/listorder/:id", apiController.handleShowOrderUser)


    return app.use("/api/v1/", router);
}

export default initapiRoute;