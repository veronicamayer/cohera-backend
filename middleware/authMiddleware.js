import { createHmac } from "crypto";
import { verifyToken } from "../util/token.js";

export const encryptPassword = (req, res, next) => {
    const hmac = createHmac("sha512", req.body.password);
    req.body.password = hmac.digest("hex");
    next();
};

export const verifyJWTToken = (req, res, next) => {
    const token = req.cookies.token;
    try {
        const userClaim = verifyToken(token);
        req.user = userClaim;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).end();
    }
};

export const deleteCookie = (req, res, next) => {
    res.clearCookie("token", { httpOnly: true, secure: true });
    next();
};
