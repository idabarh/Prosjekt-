import express from "express";
import * as crypto from "node:crypto";
import pool from "../data/database.mjs";
import HTTP_CODES from "../utils/httpCodes.mjs";

const router = express.Router();

function hashPassword(pswhash) {
    return crypto.createHash("sha256").update(pswhash).digest("hex");
}

// Registrer en ny bruker
router.post("/register", async (req, res) => {
    const { name, email, pswhash } = req.body;

    if (!name || !email || !pswhash) {
        return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ error: "Alle felt må fylles ut" });
    }

    try {
        const hashedPassword = hashPassword(pswhash);
        const result = await pool.query(
            "INSERT INTO users (name, email, pswhash) VALUES ($1, $2, $3) RETURNING id, name, email",
            [name, email, hashedPassword]
        );
        res.status(HTTP_CODES.SUCCESS.CREATED).json(result.rows[0]);
    } catch (error) {
        console.error("Feil ved registrering:", error.message);
        res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

// Logg inn en bruker
router.post("/login", async (req, res) => {
    const { email, pswhash } = req.body;

    if (!email || !pswhash) {
        return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ error: "Alle felt må fylles ut" });
    }

    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ error: "Bruker ikke funnet" });
        }

        const user = result.rows[0];
        const hashedPassword = hashPassword(pswhash);

        // Sammenlign passordet
        if (hashedPassword !== user.pswhash) {
            return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ error: "Feil passord" });
        }

        // Sett brukerens ID i sesjonen
        if (!req.session) {
            return res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ error: "Session ikke tilgjengelig" });
        }

        req.session.userId = user.id;
        res.json({ message: "Innlogging vellykket", user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        console.error("Feil ved innlogging:", error.message);
        res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

export default router;
