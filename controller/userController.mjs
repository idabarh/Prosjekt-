import dbManager from "../database/dbManager.mjs";
import crypto from 'crypto';

function hashPassword(password) {
    return crypto.createHash("sha256").update(password).digest("hex");
}

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Alle felt må fylles ut" });
    }

    try {
        const hashedPassword = hashPassword(password); // Hash passordet før lagring
        const result = await dbManager.create(
            "INSERT INTO users (name, email, pswhash) VALUES ($1, $2, $3) RETURNING id, name, email, pswhash",
            [name, email, hashedPassword] // Bruk det hashede passordet
        );
        res.status(201).json(result[0]); // Returner den opprettede brukeren
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
