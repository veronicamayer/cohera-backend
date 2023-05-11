import "./util/config.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { login, register } from "./controller/authController.js";
import {
    encryptPassword,
    verifyJWTToken,
    deleteCookie,
} from "./middleware/authMiddleware.js";
import {
    getAllShops,
    addFavorites,
    getFavorites,
    deleteFavorites,
} from "./controller/apiController.js";
import { getDb } from "./util/db.js";

const BACKEND_PORT = process.env.BACKEND_PORT;
const app = express();
const CORS_WHITELIST = process.env.CORS_WHITELIST;

app.use(morgan("dev"));
app.use(
    cors({
        origin: CORS_WHITELIST,
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("Alles OKAY");
});

app.get("/cookieSetzen", (req, res) => {
    res.cookie("testNameKey", "testTextValue");
    res.status(200).send("Cookie gesetzt Alles OKAY");
});

app.get("/cookieAuslesen", (req, res) => {
    console.log(req.cookies.token);
    res.end();
});

app.post("/register", encryptPassword, register);

app.post("/login", encryptPassword, login);

app.get("/userValidate", verifyJWTToken, (req, res) => {
    console.log(req.user);
    res.end();
});

app.get("/logout", deleteCookie, (req, res) => {
    res.status(302).redirect("/");
});

app.get("/api/allshops", getAllShops);

app.get("/favorites/:email", getFavorites);

app.put("/favorites/:email", addFavorites);

app.delete("/favorites/:email", deleteFavorites);

app.listen(BACKEND_PORT, () => {
    console.log(`Server läuft auf Port: ${BACKEND_PORT} `);
});
