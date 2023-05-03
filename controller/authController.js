import { getDb } from "../util/db.js";
import { createToken } from "../util/token.js";

const cookieConfig = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
};

export const register = async (req, res) => {
    const db = await getDb();
    const result = await db
        .collection("UserAuthentication")
        .insertOne(req.body);
    res.status(201).json(result);
};

export const login = async (req, res) => {
    const db = await getDb();
    const dbUser = await db
        .collection("UserAuthentication")
        .findOne({ user: req.body.user, password: req.body.password });
    if (dbUser === null) {
        res.status(401).end();
    } else {
        const token = createToken(dbUser);
        res.cookie("token", token, cookieConfig);
        res.end();
    }
};
