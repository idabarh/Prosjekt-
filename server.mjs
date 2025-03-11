import express from 'express';
import HTTP_CODES from "./utils/httpCodes.mjs";
import middleware from "./Modules/middleware.mjs";
import patternRoutes from "./routes/patternRoutes.mjs";

const server = express();
const port = process.env.PORT || 8000;

server.set('port', port);

server.use(express.json());
server.use("/patterns", patternRoutes);
server.use(middleware);
server.use(express.static('public'));

// Sørg for at manifest.json og serviceWorker.js blir servert riktig
server.get('/manifest.json', (req, res) => {
    res.sendFile('manifest.json', { root: 'public' });
});

server.get('/serviceWorker.js', (req, res) => {
    res.sendFile('serviceWorker.js', { root: 'public' });
});

server.listen(server.get('port'), function () {
    console.log('Server kjører på port', server.get('port'));
});
