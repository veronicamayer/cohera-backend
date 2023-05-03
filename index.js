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
import { getAllShops } from "./controller/apiController.js";
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

app.put("/users/:email", async (req, res) => {
    const userEmail = req.params.email;
    const newFavorite = req.body.favorite;

    const db = await getDb();
    const result = await db
        .collection("UserAuthentication")
        .findOneAndUpdate(
            { user: userEmail },
            { $push: { favorites: newFavorite } },
            function (err, result) {
                if (err) {
                    console.log("Error updating document:", err);
                    res.status(500).send("Error updating document");
                } else {
                    console.log("Document updated successfully");
                    res.status(200).send("Document updated successfully");
                }
            }
        );
});

app.get("/favorites", async (req, res) => {
    try {
        const db = await getDb();
        const result = await db
            .collection("UserAuthentication")
            .findOne({ user: "nocheintest@mail.de" });
        res.json(result.favorites);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});

app.listen(BACKEND_PORT, () => {
    console.log(`Server läuft auf Port: ${BACKEND_PORT} `);
});
