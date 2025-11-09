import { Router } from "express";
import { insertReading } from "../controllers/ecg_readings.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/roles.middleware.js";

const router = Router();

router.use(verifyToken, checkRole(["doc"]));
router.post("/", insertReading);

export default router;

