import express from 'express';
import dotenv from "dotenv";
import { sessionMiddleware } from "./Modules/sessionMiddleware.mjs";
import patternRoutes from "./routes/patternRoutes.mjs";
import userRoutes from "./routes/userRoutes.mjs";
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const server = express();
const port = process.env.PORT || 8080;

// Sett opp middleware
server.use(cors());
server.use(cookieParser());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static('public'));

// Bruk session middleware
server.use(sessionMiddleware);

// Test-session for å sjekke at det fungerer
server.get("/test-session", (req, res) => {
  req.session.userId = req.session.userId || Math.floor(Math.random() * 1000);
  req.session.timestamp = new Date().toISOString();
  req.saveSession();
  
  res.json({ message: "Session lagret!", session: req.session });
});

// API-ruter
server.use("/users", userRoutes);
server.use("/patterns", patternRoutes);

// Server manifest og service worker
server.get('/manifest.json', (req, res) => res.sendFile('manifest.json', { root: 'public' }));
server.get('/serviceWorker.js', (req, res) => res.sendFile('serviceWorker.js', { root: 'public' }));

// Start serveren
server.listen(port, () => {
  console.log(`Server kjører på port ${port}`);
});
