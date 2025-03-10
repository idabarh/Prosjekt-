import express from 'express'
import HTTP_CODES from "./utils/httpCodes.mjs";
import middleware from "./Modules/middleware.mjs";
import patternRoutes from "./routes/patternRoutes.mjs"


const server = express();
const port = (process.env.PORT || 8000);

server.set('port', port);

server.use(express.json());
server.use("/patterns", patternRoutes); 

server.use(middleware);
server.use(express.static('public'));

/*server.get('/test-session', (req, res) => {
    req.session.visits = (req.session.visits || 0) + 1;
    req.saveSession();
    res.send(`Antall besøk: ${req.session.visits}`);
});*/


server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});
