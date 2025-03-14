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
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ error: "Alle felt må fylles ut" });
    }

    try {
        const hashedPassword = hashPassword(password);
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
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Alle felt må fylles ut" });
    }

    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Bruker ikke funnet" });
        }

        const user = result.rows[0];
        const hashedPassword = hashPassword(password);

        if (hashedPassword !== user.pswhash) {
            return res.status(400).json({ error: "Feil passord" });
        }

        // Oppdater session med riktig userId
        req.session.userId = user.id;
        req.saveSession();

        res.json({ message: "Innlogging vellykket", user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        console.error("Feil ved innlogging:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Slett bruker
router.delete("/me", async (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: "Du må være logget inn for å slette kontoen din." });
    }

    const userId = parseInt(req.session.userId, 10); // Konverter session.userId til tall

    if (isNaN(userId)) {
        return res.status(400).json({ error: "Ugyldig bruker-ID." });
    }

    try {
        console.log(`Sletter bruker med ID: ${userId}`);

        const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Bruker ikke funnet." });
        }

        // Fjern brukerens session
        delete req.session.userId;
        req.saveSession();

        res.json({ message: "Bruker slettet!", user: result.rows[0] });
    } catch (error) {
        console.error("Feil ved sletting av bruker:", error);
        res.status(500).json({ error: "Kunne ikke slette brukeren." });
    }
});

export default router;
