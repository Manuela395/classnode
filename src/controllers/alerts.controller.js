import { ok, created, badReq, notFound, serverErr } from "../_helpers/response_data.js";
import { createAlert, getAllAlerts, getAllAlerts as getAlerts, updateAlert, deleteAlert } from "../services/alerts.service.js";

export async function createAlertController(req, res) {
  try {
    const a = await createAlert(req.body);
    return created(res, { alert: a });
  } catch (e) {
    if (e.message === "FIELDS_REQUIRED") return badReq(res, e.message);
    if (e.message === "ECG_READING_NOT_FOUND") return notFound(res, e.message);
    return serverErr(res, e);
  }
}

export async function getAllAlertsController(_req, res) {
  try {
    const alerts = await getAlerts();
    return ok(res, { alerts });
  } catch (e) {
    return serverErr(res, e);
  }
}

export async function updateAlertController(req, res) {
  try {
    const a = await updateAlert(req.body);
    return ok(res, { alert: a });
  } catch (e) {
    if (e.message === "ID_REQUIRED") return badReq(res, e.message);
    if (e.message === "ALERT_NOT_FOUND") return notFound(res, e.message);
    return serverErr(res, e);
  }
}

export async function deleteAlertController(req, res) {
  try {
    await deleteAlert(req.params.id);
    return ok(res, { message: "ALERT_DELETED" });
  } catch (e) {
    if (e.message === "ALERT_NOT_FOUND") return notFound(res, e.message);
    return serverErr(res, e);
  }
}
