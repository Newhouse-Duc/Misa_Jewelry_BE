import produtcServices from '../service/produtcServices';
import uploadmulter from '../config/uploadmulter'

const handleCreateNewproduct = async (req, res) => {



    try {
        if (!req.body.productname || !req.body.valueprice || !req.body.valuedescription || !req.body.categoryid) {
            return res.status(200).json({
                EM: "mising data required",
                EC: '1',
                DT: '',
            })
        }
        let imagePath = req.file ? `/uploads/${req.file.filename}` : null;
        let data = await produtcServices.Createproduct(req.body, imagePath)
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: '',
        });
    } catch (error) {
        console.error("Error in handleCreateProduct: ", error);
        return res.status(500).json({
            EM: "Error from server",
            EC: -1,
            DT: '',
        });
    }
}

const handlegetAllproduct = async (req, res) => {
    setTimeout(async () => {
        try {
            let data = await produtcServices.getAllProduct();
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                EM: "error from server",
                EC: '-1',
                DT: '',

            })
        }
    }, 500)
}


const handleDeleteProduct = async (req, res) => {
    try {
        let data = await produtcServices.deleteProduct(req.body.id);

        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: "error from server",
            EC: '-1',
            DT: '',

        })
    }
}
const handleGetproductbyId = async (req, res) => {
    try {
        let data = await produtcServices.getProductById(req.params.id)

        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: "error from server",
            EC: '-1',
            DT: '',

        })
    }
}

const handleChangeProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        if (!req.body.productname || !req.body.valueprice || !req.body.valuedescription || !req.body.categoryid) {
            return res.status(200).json({
                EM: "Thiếu dữ liệu yêu cầu",
                EC: 1,
                DT: '',
            });
        }


        let imagePath = req.file ? `/uploads/${req.file.filename}` : null;


        let data = await produtcServices.changeProduct(productId, req.body, imagePath);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: '',
        });
    } catch (error) {
        console.error("Error in handleChangeProduct: ", error);
        return res.status(500).json({
            EM: "Lỗi từ server",
            EC: -1,
            DT: '',
        });
    }
};


module.exports = {
    handleCreateNewproduct, handlegetAllproduct, handleDeleteProduct, handleGetproductbyId, handleChangeProduct
}