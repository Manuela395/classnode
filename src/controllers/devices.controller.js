import { ok, created, badReq, serverErr, notFound, conflict } from "../_helpers/response_data.js";
import { getAllDevices, getDeviceById, createDevice, updateDevice, deleteDevice } from "../services/devices.service.js";

export async function listDevices(req, res) {
  try {
    const devices = await getAllDevices();
    return ok(res, { devices });
  } catch (e) {
    return serverErr(res, e);
  }
}

export async function getDevice(req, res) {
  try {
    const device = await getDeviceById(req.params.id);
    return ok(res, { device });
  } catch (e) {
    if (e.message === "NOT_FOUND") return notFound(res);
    return serverErr(res, e);
  }
}

export async function createDeviceController(req, res) {
  try {
    const device = await createDevice(req.body);
    return created(res, { device });
  } catch (e) {
    if (e.message === "DEVICE_EXISTS") return conflict(res, "DEVICE_EXISTS");
    return serverErr(res, e);
  }
}

export async function updateDeviceController(req, res) {
  try {
    const device = await updateDevice(req.params.id, req.body);
    return ok(res, { device });
  } catch (e) {
    if (e.message === "NOT_FOUND") return notFound(res);
    return serverErr(res, e);
  }
}

export async function deleteDeviceController(req, res) {
  try {
    await deleteDevice(req.params.id);
    return ok(res, { deleted: true });
  } catch (e) {
    if (e.message === "NOT_FOUND") return notFound(res);
    return serverErr(res, e);
  }
}
