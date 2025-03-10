import express from "express";
import HTTP_CODES from "../utils/httpCodes.mjs";

const router = express.Router();

//Heklemønstre
let patternCollection = [
    {
        id: "1",
        name: "Heklet lue",
        difficulty: "Lett",
        materials: ["Garn", "Heklenål 4mm"],
        instructions: "Start med en magisk ring..."
    },
    {
        id: "2",
        name: "Heklet gryteklut",
        difficulty: "Middels",
        materials: ["Bomullsgarn", "Heklenål 3mm"],
        instructions: "Hekle 30 luftmasker..."
    }
];

//GET: Hent alle heklemønstre
router.get("/", (req, res) => {
    res.status(HTTP_CODES.SUCCESS.OK).json(patternCollection);
});

//GET: Hent én spesifikk oppskrift
router.get("/:id", (req, res) => {
    function findPatternById(id) {
        return patternCollection.find(p => p.id === id);
    }
    
    const pattern = findPatternById(req.params.id);
    pattern ? res.json(pattern) : res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).json({ message: "Oppskrift ikke funnet" });
});

//POST: Legg til ny oppskrift
router.post("/", (req, res) => {
    function addPattern(data) {
        const newPattern = { id: Date.now().toString(), ...data };
        patternCollection.push(newPattern);
        return newPattern;
    }

    const newPattern = addPattern(req.body);
    res.status(HTTP_CODES.SUCCESS.CREATED).json(newPattern);
});

//PUT: Oppdater en oppskrift
router.put("/:id", (req, res) => {
    function updatePattern(id, updatedData) {
        const index = patternCollection.findIndex(p => p.id === id);
        if (index === -1) return null;

        patternCollection[index] = { ...patternCollection[index], ...updatedData };
        return patternCollection[index];
    }

    const updatedPattern = updatePattern(req.params.id, req.body);
    updatedPattern ? res.json(updatedPattern) : res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).json({ message: "Oppskrift ikke funnet" });
});

//DELETE: Slett en oppskrift
router.delete("/:id", (req, res) => {
    function deletePattern(id) {
        const index = patternCollection.findIndex(p => p.id === id);
        if (index === -1) return false;

        patternCollection.splice(index, 1); 
        return true;
    }

    const deleted = deletePattern(req.params.id);
    deleted ? res.json({ message: "Oppskrift slettet" }) : res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).json({ message: "Oppskrift ikke funnet" });
});

export default router;
