import fs from 'fs';

const sessionDataFile = './sessionData.json';


if (!fs.existsSync(sessionDataFile)) {
    fs.writeFileSync(sessionDataFile, JSON.stringify({}), 'utf8');
}

const middleware = (req, res, next) => {
    let sessionData = {};

    try {
        const fileContent = fs.readFileSync(sessionDataFile, 'utf8');
        sessionData = fileContent ? JSON.parse(fileContent) : {};
    } catch (error) {
        console.error("Feil ved lesing av sessionData.json:", error);
    }

    const sessionId = req.headers['x-session-id'] || 'default';

    if (!sessionData[sessionId]) {
        sessionData[sessionId] = {};
        try {
            fs.writeFileSync(sessionDataFile, JSON.stringify(sessionData, null, 2), 'utf8');
        } catch (error) {
            console.error("Feil ved skriving til sessionData.json:", error);
        }
    }

    req.session = sessionData[sessionId];

    req.saveSession = () => {
        sessionData[sessionId] = req.session;
        try {
            fs.writeFileSync(sessionDataFile, JSON.stringify(sessionData, null, 2), 'utf8');
        } catch (error) {
            console.error("Feil ved lagring av sessionData.json:", error);
        }
    };

    next();
};

export default middleware;

