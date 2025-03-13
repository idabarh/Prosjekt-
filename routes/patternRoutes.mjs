import express from "express";
import {
  getAllPatterns,
  getPatternById,
  createPattern,
  updatePattern,
  deletePattern,
} from "../data/patternController.mjs";


const router = express.Router();

router.get("/", getAllPatterns);
router.get("/:id", getPatternById);
router.post("/", createPattern);
router.put("/:id", updatePattern);
router.delete("/:id", deletePattern);

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM patterns");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
