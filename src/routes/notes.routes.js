// src/routes/notes.routes.js
import { Router } from "express";
import {
  createNoteController,
  getAllNotesController,
  updateNoteController,
  deleteNoteController,
} from "../controllers/notes.controller.js";
import { requiredAuth } from "../middleware/auth.middleware.js";

const r = Router();
r.post("/create", requiredAuth, createNoteController);
r.get("/getAll", requiredAuth, getAllNotesController);
r.put("/update", requiredAuth, updateNoteController);
r.delete("/delete/:id", requiredAuth, deleteNoteController);

export default r;
