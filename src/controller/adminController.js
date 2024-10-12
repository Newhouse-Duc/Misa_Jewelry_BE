import { DatabaseError } from 'sequelize'
import adminService from '../service/adminService';



const handleUser = async (req, res) => {


    setTimeout(async () => {
        try {
            let data = await adminService.getUser();
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


const handleOrder = async (req, res) => {
    setTimeout(async () => {
        try {
            let data = await adminService.getOrder()
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
    })
}


const handlegetdetailid = async (req, res) => {
    try {
        let data = await adminService.getdetailbyid(req.params.id)

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

const handleadminLogin = async (req, res) => {

    try {


        let data = await adminService.handleloginadmin(req.body)
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


const handleDelorder = async (req, res) => {
    try {

        let data = await adminService.delOrder(req.params.id)
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })

    } catch (error) {

        return res.status(500).json({
            EM: "error from server",
            EC: '-1',
            DT: '',

        })
    }
}


const handleChange = async (req, res) => {
    try {
        const userId = req.params.id;
        const newStatus = req.body.newStatus;
        let data = await adminService.changeActiveUser(userId, newStatus);

        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });

    } catch (error) {

        return res.status(500).json({
            EM: "Lỗi từ server",
            EC: '-1',
            DT: ''
        });
    }
};

const handleDeluser = async (req, res) => {
    try {

        let data = await adminService.delUser(req.params.id)
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    } catch (error) {

        return res.status(500).json({
            EM: "Lỗi từ server",
            EC: '-1',
            DT: ''
        });
    }
}


const handleChangeStatusOrder = async (req, res) => {
    try {
        const orderid = req.params.id;
        const newStatus = req.body.newStatus;
        let data = await adminService.StatusOrder(orderid, newStatus)
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });
    } catch (error) {
        return res.status(500).json({
            EM: "Lỗi từ server",
            EC: '-1',
            DT: ''
        });
    }
}


const handleGetallDetailOrder = async (req, res) => {
    try {
        let data = await adminService.getAlldetailorder();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });
    } catch (error) {
        return res.status(500).json({
            EM: "Lỗi từ server",
            EC: '-1',
            DT: ''
        });
    }
}
module.exports = {
    handleUser, handleOrder, handlegetdetailid, handleadminLogin, handleDelorder, handleChange, handleDeluser, handleChangeStatusOrder, handleGetallDetailOrder
}