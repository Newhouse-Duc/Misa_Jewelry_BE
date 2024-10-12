import express from 'express';
import adminController from '../controller/adminController';
import categoryController from '../controller/categoryController';
import productController from '../controller/productController'
import uploadmulter from '../config/uploadmulter'
import { CheckJWT } from '../middleware/jwtmiddleware.js';

const router = express.Router();
/**
 * 
 * @param {*} app : express app
 */


const initapiadminRoute = (app) => {

    router.post("/login/admin", adminController.handleadminLogin)



    router.get("/getuser", adminController.handleUser);

    router.put("/update/user/:id/status", adminController.handleChange)
    router.delete("/delete/user/:id", adminController.handleDeluser)



    // product 
    router.post("/create/product", uploadmulter.single('img'), productController.handleCreateNewproduct)
    router.get("/get/product", productController.handlegetAllproduct)
    router.delete("/delete/product", productController.handleDeleteProduct)
    router.get("/get/product/:id", productController.handleGetproductbyId)
    router.put("/edit/product/:id", uploadmulter.single('img'), productController.handleChangeProduct);


    // category
    router.get("/category", categoryController.handlerCategory)
    router.post("/createcategory", categoryController.handleCreateCategory)
    router.delete("/delete/category", categoryController.handleDeleteCategory)
    router.put("/update/category", categoryController.handlEditCategory)

    //order
    router.get("/get/order", adminController.handleOrder);
    router.delete("/delete/order/:id", adminController.handleDelorder)
    router.put("/update/order/:id/status", adminController.handleChangeStatusOrder)
    router.get("/get/detail/:id", adminController.handlegetdetailid)
    router.get("/get/orderdetail", adminController.handleGetallDetailOrder);





    return app.use("/api/v2/", router);
}

export default initapiadminRoute;


