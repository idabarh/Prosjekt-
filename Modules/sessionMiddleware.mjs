import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Hent riktig filbane for session-data
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sessionFile = path.join(__dirname, '../data/sessionData.json');

// Last inn eksisterende session-data
let sessions = {};
if (fs.existsSync(sessionFile)) {
  try {
    const data = fs.readFileSync(sessionFile, 'utf-8');
    sessions = JSON.parse(data);
  } catch (err) {
    console.error("Feil ved lesing av sessionData.json:", err);
  }
}

// Middleware for å håndtere sessions
export function sessionMiddleware(req, res, next) {
  let sessionId = req.cookies.sessionId;

  if (!sessionId || !sessions[sessionId]) {
    sessionId = Math.random().toString(36).substring(2, 15);
    sessions[sessionId] = { createdAt: new Date().toISOString(), visits: 0 };
    res.cookie('sessionId', sessionId, { httpOnly: true });
  }

  req.session = sessions[sessionId];
  req.session.visits += 1;

  // Funksjon for å lagre sessions
  req.saveSession = () => {
    fs.writeFile(sessionFile, JSON.stringify(sessions, null, 2), (err) => {
      if (err) console.error("Feil ved lagring av sessionData.json:", err);
    });
  };

  req.saveSession();
  next();
}

// Lagre sessioner ved avslutning
process.on('exit', () => fs.writeFileSync(sessionFile, JSON.stringify(sessions, null, 2)));
process.on('SIGINT', () => {
  fs.writeFileSync(sessionFile, JSON.stringify(sessions, null, 2));
  process.exit();
});

export function authenticateUser(req, res, next) {
  if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: "Du må være logget inn for å gjøre dette" });
  }
  next();
}

