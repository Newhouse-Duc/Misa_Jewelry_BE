import bcrypt from 'bcryptjs';
import mysql from 'mysql2'
import db from '../models/index'


require('dotenv').config()
import { Op } from 'sequelize';
import { createJWTAdmin } from '../middleware/jwtmiddleware.js'

const salt = bcrypt.genSaltSync(10);

const checkPassword = (inputPassword, hassPassword) => {
    {
        return bcrypt.compareSync(inputPassword, hassPassword);
    }
}


const handleloginadmin = async (rawData) => {

    try {


        if (!rawData.valueLogin) {
            return {
                EM: 'Thiếu tài khoản',
                EC: 1,
                DT: ''
            };
        }
        let admin = await db.Admin.findOne({
            where: {
                [Op.or]: [
                    { email: rawData.valueLogin },
                    { role: 'admin' }
                ]
            }
        });

        if (admin) {
            let isPassword = checkPassword(rawData.password, admin.password);
            if (isPassword === true) {
                let payload = {
                    id: admin.id,
                    email: admin.email,
                    username: admin.username,
                    expiresIn: process.env.JWT_EXPIRES_IN
                };
                let token = createJWTAdmin(payload);

                return {
                    EM: 'Login success',
                    EC: 0,
                    DT: {
                        access_token_admin: token,
                        admin: {
                            id: admin.id,
                            email: admin.email,
                            username: admin.username
                        }
                    }
                };
            } else {
                return {
                    EM: 'tài khoản đăng nhập hoặc mật khẩu không chính xác',
                    EC: 1,
                    DT: ''
                };
            }
        }
        else {
            return {
                EM: 'Người dùng không tồn tại',
                EC: 1,
                DT: ''
            };
        }



    } catch (e) {
        console.log("Lỗi: ", e);
        return {
            EM: "Lỗi từ server",
            EC: -2,
            DT: ''
        };
    }
}


// management user 
const getUser = async () => {



    try {

        let users = [];
        users = await db.User.findAll();
        if (users) {

            return {
                EM: 'lấy data thành côngg',
                EC: 0,
                DT: users
            }
        } else {
            return {
                EM: 'lấy data thất bại ',
                EC: 0,
                DT: []
            }
        }



    } catch (error) {
        return {
            EM: 'lỗi',
            EC: 0,
            DT: []
        }
    }


}

const getOrder = async () => {
    try {
        let order = [];
        order = await db.Order.findAll();
        if (order) {


            return {
                EM: 'lấy data thành côngg',
                EC: 0,
                DT: order
            }
        } else {
            return {
                EM: 'lấy data thất bại',
                EC: 0,
                DT: []
            }
        }

    } catch (error) {
        return {
            EM: 'lỗi',
            EC: 0,
            DT: []
        }
    }
}

const getdetailbyid = async (orderid) => {
    try {

        let detail = await db.OrderDetail.findAll({
            where: { order_id: orderid }
        });
        if (detail) {


            if (detail.product_img) {
                detail.product_img = `${process.env.BASE_URL}${detail.product_img}`;
            }
            return {
                EM: 'lấy data thành côngg',
                EC: 0,
                DT: detail
            };
        } else {
            return {
                EM: 'lấy data thất bại',
                EC: 1,
                DT: null
            };
        }
    } catch (error) {
        console.error(error);
        return {
            EM: "Lỗi không lấy được ",
            EC: -2,
            DT: null
        };
    }
};
const getAlldetailorder = async () => {
    try {

        let detail = await db.OrderDetail.findAll();
        if (detail) {

            return {
                EM: 'lấy data thành côngg',
                EC: 0,
                DT: detail
            };
        } else {
            return {
                EM: 'lấy data thất bại',
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


const StatusOrder = async (idorder, newStatus) => {
    try {

        const result = await db.Order.update(
            { status: newStatus },
            { where: { id: idorder } }
        );
        if (result[0] === 0) {
            return {
                EM: "Không tìm thấy đơn hàng cần cập nhật",
                EC: -1,
                DT: []
            };
        } else {
            return {
                EM: "Cập nhật trạng thái thành công",
                EC: 0,
                DT: []
            };
        }

    } catch (error) {
        console.error(error);
        return {
            EM: "Lỗi không thay đổi được trạng thái đơn hàng ",
            EC: -2,
            DT: null
        };
    }
}


const delOrder = async (orderid) => {
    try {

        const result = await db.Order.destroy({
            where: { id: orderid },
        });
        if (result === 0) {
            return {
                EM: "không tìm thấy đơn hàng cần xóa  ",
                EC: -1,
                DT: null
            };
        } else {
            return {
                EM: "xóa được đơn hàng rồi nè hihi  ",
                EC: 0,
                DT: null
            };
        }

    } catch (error) {
        console.error(error);
        return {
            EM: "Lỗi không xóa được đơn hàng ",
            EC: -2,
            DT: null
        };
    }
}


const changeActiveUser = async (iduser, newStatus) => {
    try {

        const result = await db.User.update(
            { status: newStatus },
            { where: { id: iduser } }
        );
        if (result[0] === 0) {
            return {
                EM: "Không tìm thấy người dùng cần cập nhật",
                EC: -1,
                DT: []
            };
        } else {
            return {
                EM: "Cập nhật trạng thái thành công",
                EC: 0,
                DT: []
            };
        }

    } catch (error) {
        console.error(error);
        return {
            EM: "Lỗi không thể cập nhật trạng thái người dùng",
            EC: -2,
            DT: []
        };
    }
}


const delUser = async (userid) => {
    try {

        const result = await db.User.destroy({
            where: { id: userid },
        });
        if (result === 0) {
            return {
                EM: "không tìm thấy người dùng cần xóa  ",
                EC: -1,
                DT: null
            };
        } else {
            return {
                EM: "xóa người dùng thành công ",
                EC: 0,
                DT: null
            };
        }

    } catch (error) {
        console.error(error);
        return {
            EM: "Lỗi không xóa được đơn hàng ",
            EC: -2,
            DT: null
        };
    }
}


module.exports = {
    getUser, getOrder, getdetailbyid, handleloginadmin, StatusOrder, delOrder, changeActiveUser, delUser, getAlldetailorder
}