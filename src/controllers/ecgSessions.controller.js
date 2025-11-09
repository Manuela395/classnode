import { ok, created, badReq, notFound, serverErr } from "../_helpers/response_data.js";
import {
  createECGSession,
  getAllECGSessions,
  getECGSessionById,
  updateECGSession,
  deleteECGSession,
  getEligiblePatientsForSession,
  getActivePatientsForReadings,
} from "../services/ecgSessions.service.js";

export async function createECGSessionController(req, res) {
  try {
    const s = await createECGSession(req.body);
    return created(res, { ecg_session: s });
  } catch (e) {
    if (e.message === "FIELDS_REQUIRED") return badReq(res, e.message);
    if (["APPOINTMENT_NOT_FOUND","CLINICAL_NOT_FOUND","DEVICE_NOT_FOUND"].includes(e.message)) return notFound(res, e.message);
    return serverErr(res, e);
  }
}

export async function getAllECGSessionsController(_req, res) {
  try {
    const s = await getAllECGSessions();
    return ok(res, { ecg_sessions: s });
  } catch (e) {
    return serverErr(res, e);
  }
}

export async function getECGSessionByIdController(req, res) {
  try {
    const s = await getECGSessionById(req.params.id);
    if (!s) return notFound(res, "ECG_SESSION_NOT_FOUND");
    return ok(res, { ecg_session: s });
  } catch (e) {
    return serverErr(res, e);
  }
}

export async function updateECGSessionController(req, res) {
  try {
    const s = await updateECGSession(req.params.id, req.body);
    return ok(res, { ecg_session: s });
  } catch (e) {
    if (e.message === "ID_REQUIRED") return badReq(res, e.message);
    if (e.message === "ECG_SESSION_NOT_FOUND") return notFound(res, e.message);
    return serverErr(res, e);
  }
}

export async function deleteECGSessionController(req, res) {
  try {
    await deleteECGSession(req.params.id);
    return ok(res, { message: "ECG_SESSION_DELETED" });
  } catch (e) {
    if (e.message === "ECG_SESSION_NOT_FOUND") return notFound(res, e.message);
    return serverErr(res, e);
  }
}

export async function getEligiblePatientsController(_req, res) {
  try {
    const patients = await getEligiblePatientsForSession();
    return ok(res, { patients });
  } catch (e) {
    console.error("Error en getEligiblePatientsController:", e.message);
    return serverErr(res, e);
  }
}

export async function getActivePatientsController(_req, res) {
  try {
    const patients = await getActivePatientsForReadings();
    return ok(res, { patients });
  } catch (e) {
    console.error("Error en getActivePatientsController:", e.message);
    return serverErr(res, e);
  }
}
