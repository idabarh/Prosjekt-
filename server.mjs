import express from 'express'
import HTTP_CODES from "./utils/httpCodes.mjs";

const server = express();
const port = (process.env.PORT || 8000);

server.set('port', port);
server.use(express.static('public'));

function getRoot(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).send('Hello World').end();
}

function getPoem(req, res, next) {

    const poem = `
    Mørket hvisker, lyset ler,
    natten skjuler det dagen ser.
    Stjerner blinker, vinden går,
    tiden stanser – men hjertet slår.`;

    res.status(HTTP_CODES.SUCCESS.OK).send(`${poem}`).end();
}

function getQuotes(req, res, next) {
    const quote = [
    "Happiness depends upon ourselves. – Aristotle",
    "Do what you can, with what you have, where you are. – Theodore Roosevelt",
    "Stars can’t shine without darkness. – Unknown",
    "Act as if what you do makes a difference. It does. – William James",
    "Be yourself; everyone else is already taken. – Oscar Wilde" ];

    const randomQuote = quote[Math.floor(Math.random()* quote.length)];
    res.status(HTTP_CODES.SUCCESS.OK).send(randomQuote).end();

}

function postSum (req, res, next ){
    const { a, b} = req.params;

    const numA = parseFloat(a);
    const numB = parseFloat(b);

    const sum = numA + numB;

    res.status(HTTP_CODES.SUCCESS.OK).send({ sum }).end();
}


server.get("/", getRoot);
server.get("/tmp/poem", getPoem);
server.get("/tmp/quote", getQuotes);
server.post("/tmp/sum/:a/:b", postSum);

server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});
