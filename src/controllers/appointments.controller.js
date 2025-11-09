import { ok, created, serverErr, notFound } from "../_helpers/response_data.js";
import {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../services/appointments.service.js";

export async function listAppointments(req, res) {
  try {
    const appointments = await getAllAppointments();
    return ok(res, { appointments });
  } catch (e) {
    return serverErr(res, e);
  }
}

export async function getAppointment(req, res) {
  try {
    const appointment = await getAppointmentById(req.params.id);
    return ok(res, { appointment });
  } catch (e) {
    if (e.message === "NOT_FOUND") return notFound(res);
    return serverErr(res, e);
  }
}

export async function createAppointmentController(req, res) {
  try {
    const appointment = await createAppointment(req.body);
    return created(res, { appointment });
  } catch (e) {
    return serverErr(res, e);
  }
}

export async function updateAppointmentController(req, res) {
  try {
    const appointment = await updateAppointment(req.params.id, req.body);
    return ok(res, { appointment });
  } catch (e) {
    if (e.message === "NOT_FOUND") return notFound(res);
    return serverErr(res, e);
  }
}

export async function deleteAppointmentController(req, res) {
  try {
    await deleteAppointment(req.params.id);
    return ok(res, { deleted: true });
  } catch (e) {
    if (e.message === "NOT_FOUND") return notFound(res);
    return serverErr(res, e);
  }
}

