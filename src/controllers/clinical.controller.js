import { ok, created, badReq, notFound, serverErr } from "../_helpers/response_data.js";
import { createClinical, getAllClinicals, getClinicalById, updateClinical, deleteClinical } from "../services/clinical.service.js";

export async function createClinicalController(req, res) {
  try {
    const clinical = await createClinical(req.body);
    return created(res, { clinical });
  } catch (e) {
    if (e.message === "APPOINTMENT_ID_REQUIRED") return badReq(res, e.message);
    if (e.message === "APPOINTMENT_NOT_FOUND") return notFound(res, e.message);
    return serverErr(res, e);
  }
}

export async function getAllClinicalsController(_req, res) {
  try {
    const clinicals = await getAllClinicals();
    return ok(res, { clinicals });
  } catch (e) {
    return serverErr(res, e);
  }
}

export async function getClinicalByIdController(req, res) {
  try {
    const c = await getClinicalById(req.params.id);
    if (!c) return notFound(res, "CLINICAL_NOT_FOUND");
    return ok(res, { clinical: c });
  } catch (e) {
    return serverErr(res, e);
  }
}

export async function updateClinicalController(req, res) {
  try {
    const c = await updateClinical(req.params.id, req.body);
    return ok(res, { clinical: c });
  } catch (e) {
    if (e.message === "ID_REQUIRED") return badReq(res, e.message);
    if (e.message === "CLINICAL_NOT_FOUND") return notFound(res, e.message);
    return serverErr(res, e);
  }
}

export async function deleteClinicalController(req, res) {
  try {
    await deleteClinical(req.params.id);
    return ok(res, { message: "CLINICAL_DELETED" });
  } catch (e) {
    if (e.message === "CLINICAL_NOT_FOUND") return notFound(res, e.message);
    return serverErr(res, e);
  }
}
