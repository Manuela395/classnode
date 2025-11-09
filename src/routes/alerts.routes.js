import { Router } from "express";
import {
  createAlertController,
  getAllAlertsController,
  updateAlertController,
  deleteAlertController,
} from "../controllers/alerts.controller.js";
import { requiredAuth } from "../middleware/auth.middleware.js";

const r = Router();
r.post("/create", requiredAuth, createAlertController);
r.get("/getAll", requiredAuth, getAllAlertsController);
r.put("/update", requiredAuth, updateAlertController);
r.delete("/delete/:id", requiredAuth, deleteAlertController);

export default r;
