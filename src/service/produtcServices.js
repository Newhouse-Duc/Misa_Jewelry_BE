import db from '../models/index'
import uploadmulter from '../config/uploadmulter'
const fs = require('fs');
const path = require('path');

const getAllProduct = async () => {
    try {

        let product = [];
        product = await db.Product.findAll();


        if (product) {
            product = product.map(p => {
                if (p.img) {
                    p.img = `${process.env.BASE_URL}${p.img}`;
                }
                return p;
            });
            return {
                EM: 'lấy data thành công',
                EC: 0,
                DT: product
            }
        } else {
            return {
                EM: 'lấy data thất bại ',
                EC: 0,
                DT: []
            }
        }

    } catch (error) {
        console.error(error);
        return {
            EM: "Lỗi không lấy được sản phẩm ",
            EC: -2,

        };
    }
}


const getProductById = async (productid) => {
    try {

        let product = await db.Product.findOne({
            where: { id: productid }
        });
        if (product) {


            if (product.img) {
                product.img = `${process.env.BASE_URL}${product.img}`;
            }
            return {
                EM: 'lấy data thành công',
                EC: 0,
                DT: product
            };
        } else {
            return {
                EM: 'lấy dũ liệu thất bại',
                EC: 1,
                DT: null
            };
        }
    } catch (error) {
        console.error(error);
        return {
            EM: "Lỗi không lấy được sản phẩm",
            EC: -2,
            DT: null
        };
    }
};



const Createproduct = async (productData, imagePath) => {
    try {
        const max_id = await db.Product.max("id");
        await db.Product.create({
            id: max_id + 1,
            productName: productData.productname,
            img: imagePath,
            price: productData.valueprice,
            description: productData.valuedescription,
            categoryid: productData.categoryid,
        });


        return {
            EM: "Tạo thành công",
            EC: 0,
            DT: '',
        };
    } catch (error) {
        console.error(error);
        return {
            EM: "Lỗi khi tạo sản phẩm",
            EC: -2,

        };
    }
}

const deleteProduct = async (productId) => {
    try {
        let product = await db.Product.findOne({
            where: { id: productId }
        });


        if (product) {
            if (product.img) {
                const imagePath = path.join(__dirname, '..', '', product.img);

                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Error deleting image:', err);
                    }
                });
            }
            await product.destroy();
            return {
                EM: "Xóa thành công",
                EC: 0,
                DT: product
            };
        } else {

            return {
                EM: "Không tìm thấy sản phẩm ",
                EC: 2,
                DT: []
            };
        }
    } catch (error) {
        console.error(error);
        return {
            EM: "Lỗi xóa sản phẩm",
            EC: -2,

        };
    }
}


const changeProduct = async (productId, productData, imagePath) => {
    try {

        const product = await db.Product.findOne({ where: { id: productId } });
        if (!product) {
            return {
                EM: "Sản phẩm không tồn tại",
                EC: 1,
                DT: ''
            };
        }

        if (imagePath && product.img) {
            const oldImagePath = path.join(__dirname, '..', '', product.img);

            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }


        await db.Product.update({
            productName: productData.productname,
            img: imagePath || product.img,
            price: productData.valueprice,
            description: productData.valuedescription,
            categoryid: productData.categoryid,
        }, {
            where: { id: productId }
        });

        return {
            EM: "Sửa sản phẩm thành công",
            EC: 0,
            DT: ''
        };
    } catch (error) {

        return {
            EM: "Lỗi khi sửa sản phẩm",
            EC: -2,
            DT: ''
        };
    }
};


module.exports = {
    Createproduct,
    getAllProduct,
    deleteProduct,
    getProductById,
    changeProduct
}
