import HTTP_CODES from "../utils/httpCodes.mjs";
import dbManager from "../data/dbManage.mjs";

// GET: Hent alle heklemønstre
export const getAllPatterns = async (req, res) => {
  try {
    const result = await dbManager.read("SELECT * FROM patterns ORDER BY id ASC");
    res.json(result);
  } catch (error) {
    res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// GET: Hent ett spesifikt heklemønster
export const getPatternById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await dbManager.read("SELECT * FROM patterns WHERE id = $1", [id]);
    if (!result || result.length === 0) {
      return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).json({ error: "Oppskrift ikke funnet" });
    }
    res.json(result[0]);
  } catch (error) {
    res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// POST: Legg til et nytt heklemønster
export const createPattern = async (req, res) => {
  const { name, difficulty, materials, instructions } = req.body;
  try {
    const query = `
      INSERT INTO patterns (name, difficulty, materials, instructions)
      VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [name, difficulty, materials, instructions];
    const result = await dbManager.create(query, values);
    res.status(HTTP_CODES.SUCCESS.CREATED).json(result[0]);
  } catch (error) {
    res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// PUT: Oppdater et heklemønster
export const updatePattern = async (req, res) => {
  const { id } = req.params;
  const { name, difficulty, materials, instructions } = req.body;
  try {
    const existingPattern = await dbManager.read("SELECT * FROM patterns WHERE id = $1", [id]);
    if (!existingPattern || existingPattern.length === 0) {
      return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).json({ error: "Oppskrift ikke funnet" });
    }
    const updatedPattern = {
      name: name || existingPattern[0].name,
      difficulty: difficulty || existingPattern[0].difficulty,
      materials: materials || existingPattern[0].materials,
      instructions: instructions || existingPattern[0].instructions
    };
    const query = `
      UPDATE patterns 
      SET name = $1, difficulty = $2, materials = $3, instructions = $4 
      WHERE id = $5 RETURNING *`;
    const values = [updatedPattern.name, updatedPattern.difficulty, updatedPattern.materials, updatedPattern.instructions, id];
    const result = await dbManager.update(query, values);
    res.json(result[0]);
  } catch (error) {
    res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// DELETE: Slett et heklemønster
export const deletePattern = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await dbManager.purge("DELETE FROM patterns WHERE id = $1 RETURNING *", [id]);
    if (!result || result.length === 0) {
      return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).json({ error: "Oppskrift ikke funnet" });
    }
    res.json({ message: "Oppskrift slettet", deletedPattern: result[0] });
  } catch (error) {
    res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};
