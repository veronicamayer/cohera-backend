import axios from "axios";
import { getDb } from "../util/db.js";

export const getAllShops = async (req, res) => {
    const options = {
        method: "GET",
        url: "https://fashion-api1.p.rapidapi.com/allshops",
        headers: {
            "X-RapidAPI-Key":
                "19b378c85fmshb943337f79f2f6cp1141e7jsnfa3ce943fc17",
            "X-RapidAPI-Host": "fashion-api1.p.rapidapi.com",
        },
    };

    try {
        const response = await axios.request(options);
        const shuffledData = shuffle(response.data); // shuffle the response data
        res.json(shuffledData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};

function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

export const getFavorites = async (req, res) => {
    try {
        const userEmail = req.params.email;
        const db = await getDb();
        const result = await db
            .collection("UserAuthentication")
            .findOne({ user: userEmail });
        res.json(result.favorites);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};

export const addFavorites = async (req, res) => {
    try {
        const userEmail = req.params.email;
        const newFavorite = req.body.favorite;
        const db = await getDb();
        const result = await db
            .collection("UserAuthentication")
            .findOneAndUpdate(
                { user: userEmail },
                { $push: { favorites: newFavorite } }
            );
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};

export const deleteFavorites = async (req, res) => {
    try {
        const userEmail = req.params.email;
        const selectedFavorite = req.body.favorite;
        const db = await getDb();
        const result = await db
            .collection("UserAuthentication")
            .findOneAndUpdate(
                { user: userEmail },
                { $pull: { favorites: selectedFavorite } }
            );
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};
