import express from 'express';
import dotenv from "dotenv";
import HTTP_CODES from "./utils/httpCodes.mjs";
import middleware from "./Modules/middleware.mjs";
import patternRoutes from "./routes/patternRoutes.mjs";
import cors from 'cors';
import userRoutes from "./routes/userRoutes.mjs"; // Sørg for at stien er korrekt


dotenv.config();

const server = express();
const port = process.env.PORT || 8000;

server.set('port', port);

server.use(middleware);

server.use(express.json());

server.use(cors());
server.use("/users", userRoutes); // Legg til ruten for /users
server.use("/patterns", patternRoutes);
server.use(express.static('public'));

// Sørg for at manifest.json og serviceWorker.js blir servert riktig
server.get('/manifest.json', (req, res) => {
    res.sendFile('manifest.json', { root: 'public' });
});

server.get('/serviceWorker.js', (req, res) => {
    res.sendFile('serviceWorker.js', { root: 'public' });
});


//middleware for å se om den fungerer
server.get('/test-session', (req, res) => {
    req.session.visits = (req.session.visits || 0) + 1;
    req.saveSession();
    res.send(`Antall besøk: ${req.session.visits}`);
});

server.listen(server.get('port'), function () {
    console.log('Server kjører på port', server.get('port'));
});
