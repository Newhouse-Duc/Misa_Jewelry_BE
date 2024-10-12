import { DatabaseError } from 'sequelize'
import customerServices from '../service/customerServices'


const testApi = (req, res) => {
    return res.status(200).json({
        message: "ok",
        data: "test api"
    })
}


const handleRegister = async (req, res) => {

    try {



        if (!req.body.email || !req.body.phone || !req.body.password) {
            return res.status(200).json({
                EM: "mising data required",
                EC: '1',
                DT: '',
            })
        }
        if (req.body.password && req.body.password.length < 3) {
            return res.status(200).json({
                EM: "your password is too short",
                EC: '1',
                DT: '',
            })
        }


        let data = await customerServices.registerNewuser(req.body)
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: '',

        })

    } catch (e) {

        return res.status(500).json({
            EM: "error from server",
            EC: '-1',
            DT: '',

        })
    }


}

const handleLogin = async (req, res) => {

    try {


        let data = await customerServices.handleUserLogin(req.body)
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    } catch (e) {
        return res.status(500).json({
            EM: "error from server",
            EC: '-1',
            DT: '',

        })
    }
}
const handlegetPaymentmethod = async (req, res) => {
    try {

        let data = await customerServices.handleShowmethodpayment();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    } catch (error) {
        console.log("lỗi gì đây : ", error)
        return res.status(500).json(
            {

                EM: " error from server",
                EC: '-1',
                DT: ''
            }
        )
    }
}


const handleOrder = async (req, res) => {
    try {


        let data = await customerServices.userOrder(req.body)
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    } catch (error) {
        console.log("lỗi order : ", error)
        return res.status(500).json(
            {

                EM: " error from server",
                EC: '-1',
                DT: ''
            }
        )
    }
}


const handleShowOrderUser = async (req, res) => {

    try {

        const data = await customerServices.UserOrder(req.params.id)
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    } catch (error) {
        console.log("lỗi order : ", error)
        return res.status(500).json(
            {
                EM: " error from server",
                EC: '-1',
                DT: ''
            }
        )
    }

}

const handleOrderpay = async (req, res) => {
    try {



        const paymentResult = await customerServices.useOrderpay(req.body);


        return res.status(200).json({
            EM: paymentResult.EM,
            EC: paymentResult.EC,
            payUrl: paymentResult.payUrl,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            EM: 'Lỗi server khi xử lý thanh toán',
            EC: 1,
        });
    }
}
const handleIPN = async (req, res) => {
    try {

        const result = await customerServices.handleMomoIPN(req.body);

        if (result.EC === 0) {
            return res.status(200).json({
                EM: result.EM,
                EC: result.EC
            });
        } else {
            return res.status(400).json({
                EM: result.EM
            });
        }
    } catch (error) {

        return res.status(500).json({
            EM: result.EM

        });
    }
};

module.exports = {
    testApi, handleRegister, handleLogin, handlegetPaymentmethod, handleOrder, handleOrderpay, handleIPN, handleShowOrderUser
}