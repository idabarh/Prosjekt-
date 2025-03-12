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

export default router;
