import express from 'express'
import HTTP_CODES from "./utils/httpCodes.mjs";

const server = express();
const port = (process.env.PORT || 8000);

server.set('port', port);
server.use(express.static('public'));

const decks = {};

function createNewDeck(){
    const cardSuits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const cardValues = ['2','3','4','5','6','7','8','9','10','Jack','Queen','King','Ace'];

    const deck = [];
    for (const suit of cardSuits){
        for (const value of cardValues){
            deck.push({suit, value});
        }
    }
    return deck;
};


//Oppretter en ny kortstokk på serveren og returnerer en unik ID for kortstokken
server.post('/temp/deck', (req, res) => {
    const deckID = `deck_${Date.now()}`;
    decks[deckID] = createNewDeck();

    res.status(HTTP_CODES.SUCCESS.CREATED).send({deck_id: deckID}).end(); 
});

// Stokke
server.patch('/temp/deck/shuffle/:deck_id', (req, res) => {
    const {deck_id} = req.params;
    const deck = decks[deck_id];

    if (!deck){
        return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send({error: 'Dekk er ikke funnet'}).end();
    };

    for (let i = deck.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    };

    res.status(HTTP_CODES.SUCCESS.OK).send({message: 'Dekk er stokket'}).end();
});


//Returnerer hele kortstokken
server.get('/temp/deck/:deck_id', (req, res) => {
    const {deck_id} = req.params;
    const deck = decks[deck_id];

    if (!deck) {
        return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send({error: 'Dekk er ikke funnet' });
    }

    res.status(HTTP_CODES.SUCCESS.OK).send({deck});
});


//Trekker og returnerer et tilfeldig kort fra den spesifiserte kortstokken.
server.get('/temp/deck/:deck_id/card', (req, res) => {
    const {deck_id} = req.params;
    const deck = decks[deck_id];

    if (!deck) {
        return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send({ error: 'Dekk er ikke funnet' });
    }

    if (deck.length === 0) {
        return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).send({ error: 'Ingen flere kort i dekk' });
    }

    const cardIndex = Math.floor(Math.random() * deck.length);
    const card = deck.splice(cardIndex, 1)[0];

    res.status(HTTP_CODES.SUCCESS.OK).send({card});
});


//Uke 3 oppgaver
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
