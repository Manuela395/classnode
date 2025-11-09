// routes/ecgStreamRoutes.js
import express from "express";
import EcgStreamController from "../controllers/ecgstreamcontroller.js";

const router = express.Router();

// Stream SSE (equivalente a sse_generator)
router.get("/stream", (req, res) => EcgStreamController.sseStream(req, res));

// Insertar bloque (POST)
router.post("/insert", (req, res) => EcgStreamController.insertBlock(req, res));

// Obtener últimos bloques (GET)
router.get("/peek", (req, res) => EcgStreamController.peekData(req, res));

export default router;