import { Router } from "express";
import {
  listDevices,
  getDevice,
  createDeviceController,
  updateDeviceController,
  deleteDeviceController,
} from "../controllers/devices.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/roles.middleware.js";

const router = Router();

// Todas las rutas de dispositivos requieren un token válido y rol de 'admin'
router.use(verifyToken, checkRole(["admin"]));

router.get("/", listDevices);
router.post("/", createDeviceController);
router.get("/:id", getDevice);
router.put("/:id", updateDeviceController);
router.delete("/:id", deleteDeviceController);

export default router;