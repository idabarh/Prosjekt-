import express from "express";
import { registerUser, loginUser } from "../controller/userController.mjs"; // Sørg for at importeringen er korrekt

const router = express.Router();

// Registrere bruker
router.post("/register", registerUser);

// Logge inn bruker
router.post("/login", loginUser);

export default router;
