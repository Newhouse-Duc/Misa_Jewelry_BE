require('dotenv').config()
import bcrypt from 'bcryptjs';
import db, { Sequelize } from "../models/index"
import { Op } from 'sequelize';
import { createJWT } from '../middleware/jwtmiddleware.js'
const axios = require('axios');
const crypto = require('crypto');
const qs = require('qs');
const moment = require('moment');
const VnPay = require('vnpay');
const salt = bcrypt.genSaltSync(10);

const hashpasssword = (userpassword) => {
    let hashpass = bcrypt.hashSync(userpassword, salt);
    return hashpass;
}
const checkEmail = async (userEmail) => {
    let user = await db.User.findOne(
        {
            where: { email: userEmail }
        }
    )
    if (user) {
        return true
    } else {
        return false
    }
}


const checkPhone = async (userPhone) => {
    let user = await db.User.findOne(
        {
            where: { phone: userPhone }
        }
    )
    if (user) {
        return true
    } else {
        return false
    }
}


const registerNewuser = async (rawUserdata) => {

    try {

        let isEmailExist = await checkEmail(rawUserdata.email)

        if (isEmailExist === true) {
            return {
                EM: 'Email này đã tồn tại',
                EC: 1
            }
        }
        let isPhoneExist = await checkPhone(rawUserdata.phone)
        if (isPhoneExist === true) {
            return {
                EM: 'số điện thoại này đã tồn tại',
                EC: 1
            }
        }


        let hashPassword = hashpasssword(rawUserdata.password)

        await db.User.create({
            email: rawUserdata.email,
            username: rawUserdata.username,
            password: hashPassword,
            phone: rawUserdata.phone
        })


        return {
            EM: " Đăng kí tài khoản thành công",
            EC: 0
        }
    } catch (e) {
        console.log(e)
        return {
            EM: " error",
            EC: -2
        }
    }


}


const checkPassword = (inputPassword, hassPassword) => {
    {
        return bcrypt.compareSync(inputPassword, hassPassword);
    }
}
const handleUserLogin = async (rawData) => {
    try {
        if (!rawData.valueLogin) {
            return {
                EM: 'Thiếu tài khoản',
                EC: 1,
                DT: ''
            };
        }

        let users = await db.User.findOne({
            where: {
                [Op.or]: [
                    { email: rawData.valueLogin },
                    { phone: rawData.valueLogin },
                ]
            }
        });


        if (users) {

            if (users.status !== 'active') {
                return {
                    EM: 'Tài khoản đã bị vô hiệu hóa',
                    EC: 1,
                    DT: ''
                };
            }
            let isPassword = checkPassword(rawData.password, users.password);

            if (isPassword === true) {
                let payload = {
                    id: users.id,
                    email: users.email,
                    username: users.username,
                    expiresIn: process.env.JWT_EXPIRES_IN
                };
                let token = createJWT(payload);

                return {
                    EM: 'Đăng nhập thành công',
                    EC: 0,
                    DT: {
                        access_token: token,
                        users: {
                            id: users.id,
                            email: users.email,
                            username: users.username
                        }
                    }
                };
            } else {
                return {
                    EM: 'Email mật khẩu không chính xác',
                    EC: 1,
                    DT: ''
                };
            }
        } else {
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


const handleShowmethodpayment = async () => {
    try {
        let payment = [];
        payment = await db.Payment.findAll();
        if (payment) {
            return {

                EC: 0,
                DT: payment,
            }
        }
        else {
            return {
                EM: 'lấy data thất bại ',
                EC: -1,
                DT: []
            }
        }
    } catch (error) {
        console.log("check lỗi : ", error)
        return {
            EM: 'lỗi ',
            EC: 1,
            DT: []
        }
    }
}


const userOrder = async (dataorder) => {



    if (!dataorder.raworder.namerecive || !dataorder.raworder.phonerecive || !dataorder.raworder.addressrecive || !dataorder.raworder.emailrecive || !dataorder.raworder.totalbill || !dataorder.raworder.idpayment) {
        return {

            EC: -1,
            DT: ''
        };
    }

    try {
        const transaction = await db.sequelize.transaction();
        try {
            const max_id = await db.Order.max("id");

            const newOrder = await db.Order.create({
                id: max_id + 1,
                user_id: dataorder.raworder.userid,
                name_receive: dataorder.raworder.namerecive,
                phone_receive: dataorder.raworder.phonerecive,
                address: dataorder.raworder.addressrecive,
                email: dataorder.raworder.emailrecive,
                total_price: dataorder.raworder.totalbill,
                payment_id: dataorder.raworder.idpayment,
            }, { transaction });

            if (!Array.isArray(dataorder.rawdetail) || dataorder.rawdetail.length === 0) {
                throw new Error('rawdetail không chứa dữ liệu hợp lệ');
            }

            const orderDetailsWithOrderId = dataorder.rawdetail.map((detail, index) => ({
                order_id: newOrder.id,
                product_id: detail.product_id,
                product_name: detail.product_name,
                quantity: detail.quantity,
                product_img: detail.img,
                product_price: detail.price,
                product_totalprice: detail.totalPrice,
            }));


            await db.OrderDetail.bulkCreate(orderDetailsWithOrderId, { transaction });


            await transaction.commit();

            return {
                EM: 'Đặt hàng thành công',
                EC: 0,
                DT: orderDetailsWithOrderId
            };
        } catch (error) {

            await transaction.rollback();
            return {
                EM: "lỗi đặt hàng",
                EC: -1,
                DT: []
            };
        }
    } catch (error) {
        console.log("check lỗi : ", error)
        return {
            EM: 'Lỗi ',
            EC: 1,
            DT: []
        }
    }
}


const useOrderpay = async (dataorder) => {
    if (!dataorder.raworder.namerecive || !dataorder.raworder.phonerecive || !dataorder.raworder.addressrecive || !dataorder.raworder.emailrecive || !dataorder.raworder.totalbill || !dataorder.raworder.idpayment) {
        return {

            EC: -1,
            DT: ''
        };
    }
    const transaction = await db.sequelize.transaction();
    try {

        const max_id = await db.Order.max("id");

        const newOrder = await db.Order.create({
            id: max_id + 1,
            user_id: dataorder.raworder.userid,
            name_receive: dataorder.raworder.namerecive,
            phone_receive: dataorder.raworder.phonerecive,
            address: dataorder.raworder.addressrecive,
            email: dataorder.raworder.emailrecive,
            total_price: dataorder.raworder.totalbill,
            payment_id: dataorder.raworder.idpayment,

        }, { transaction })
        if (!Array.isArray(dataorder.rawdetail) || dataorder.rawdetail.length === 0) {
            throw new Error('rawdetail không chứa dữ liệu hợp lệ');
        }

        const orderDetailsWithOrderId = dataorder.rawdetail.map((detail, index) => ({
            order_id: newOrder.id,
            product_id: detail.product_id,
            product_name: detail.product_name,
            quantity: detail.quantity,
            product_img: detail.img,
            product_price: detail.price,
            product_totalprice: detail.totalPrice,
        }));
        await db.OrderDetail.bulkCreate(orderDetailsWithOrderId, { transaction });


        await transaction.commit();
        const partnerCode = process.env.PARTNER_CODE;
        const accessKey = process.env.ACCESS_KEY;
        const secretKey = process.env.SECRET_KEY;
        const requestId = partnerCode + new Date().getTime();
        const orderId = newOrder.id;
        const orderInfo = "Pay with MoMo";
        const redirectUrl = `${process.env.REACT_URL}/return`;
        const ipnUrl = `${process.env.NGROK_BASE_URL_BACKEND}/api/v1/ipn`;
        const amount = dataorder.raworder.totalbill;
        const requestType = "payWithMethod";
        const extraData = "";


        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;


        const signature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');


        const requestBody = {
            partnerCode: partnerCode,
            accessKey: accessKey,
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            extraData: extraData,
            requestType: requestType,
            signature: signature,
            lang: 'en'
        };

        const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
            headers: {
                'Content-Type': 'application/json'
            }
        });


        if (response.data && response.data.payUrl) {
            return {
                EM: 'Giao dịch thành công!',
                EC: 0,
                payUrl: response.data.payUrl,
            };
        } else {

            return {
                EM: 'Lỗi từ phía MoMo',
                EC: 1,
            };
        }
    } catch (error) {
        console.log("lỗi: ", error)
    }

}
const handleMomoIPN = async (ipnData) => {


    try {
        const order = await db.Order.findOne({ where: { id: ipnData.orderId } });


        if (!order) {
            return {
                EM: 'Đơn hàng không tồn tại',
                EC: -1,
            };
        }
        if (ipnData.resultCode == 0) {
            order.status = 'confirmed';
        } else {
            order.status = 'failed';
        }
        await order.save();

        return {
            EM: "Đã lưu trạng thái đơn hàng",
            EC: 0,
        };


    } catch (error) {

        return {
            EM: ' Lỗi sửa trạng thái đơn hàng',
            EC: -2,
        }

    }
};






const UserOrder = async (iduser) => {
    try {
        let data = await db.Order.findAll(
            {
                where: { user_id: iduser }
            }
        )
        if (data) {
            return {
                EM: " lấy danh sách đơn hàng của người dùng thành công",
                EC: 0,
                DT: data
            }

        }
        else {
            return {
                EM: "không có đơn hàng nào của người dùng này",
                EC: -1,
                DT: []
            }
        }


    } catch (error) {
        console.log("lỗi: ", error);
        return {
            EM: "Có lỗi xảy ra ",
            EC: -2,

        }
    }
}


module.exports = {
    registerNewuser, handleUserLogin, handleShowmethodpayment, userOrder, useOrderpay, handleMomoIPN, UserOrder
}