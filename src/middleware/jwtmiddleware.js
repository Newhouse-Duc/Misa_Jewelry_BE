import jwt from 'jsonwebtoken';
require("dotenv").config();

export const createJWT = (payload) => {
    const key = process.env.JWT_SECRET;
    let token = null;
    try {
        token = jwt.sign(payload, key, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
    } catch (error) {
        console.log(error);
    }

    return token;
};

export const createJWTAdmin = (payload) => {
    const key = process.env.JWT_SECRET_ADMIN;
    let token = null;
    try {
        token = jwt.sign(payload, key, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
    } catch (error) {
        console.log(error);
    }

    return token;
};
export const verifyToken = (payload) => {
    let key = process.env.JWT_SECRET;
    let data = null;

    try {
        let decoded = jwt.verify(payload, key);
        data = decoded;
    } catch (error) {
        console.log(error)
    }
    return data;

}

const extractToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return null
}
const nonSecurePaths = ['/register'];

export const CheckJWT = (req, res, next) => {
    if (nonSecurePaths.includes(req.path)) return next();

    const tokenfromheaders = extractToken(req);
    if (tokenfromheaders) {
        let token = tokenfromheaders
        let decoded = verifyToken(token);

        if (decoded) {
            req.user = decoded;
            req.token = token;
            next();
        } else {
            return res.status(401).json({
                EC: -1,
                EM: ' k xác thực được người dùng ',
                DT: ''
            })
        }
    } else {
        return res.status(401).json({
            EC: -1,
            EM: " k xác thực được người dùng ",
            DT: ''
        })
    }

}

