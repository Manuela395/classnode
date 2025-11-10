import { ok, created, badReq, notFound, serverErr } from "../_helpers/response_data.js";
import {
  createECGReading,
  getAllECGReadings,
  getECGReadingById,
  ECG_READING_ERRORS,
} from "../services/ecgReadings.service.js";

export async function insertReading(req, res) {
  try {
    const reading = await createECGReading(req.body);
    return created(res, { reading });
  } catch (error) {
    switch (error.message) {
      case ECG_READING_ERRORS.REQUIRED_ERROR:
      case ECG_READING_ERRORS.INVALID_SESSION_ERROR:
      case ECG_READING_ERRORS.INVALID_RECORD_COUNT_ERROR:
        return badReq(res, error.message);
      case ECG_READING_ERRORS.SESSION_NOT_FOUND_ERROR:
        return notFound(res, error.message);
      default:
        return serverErr(res, error);
    }
  }
}

export async function listReadings(_req, res) {
  try {
    const readings = await getAllECGReadings();
    return ok(res, { readings });
  } catch (error) {
    return serverErr(res, error);
  }
}

export async function getReading(req, res) {
  try {
    const reading = await getECGReadingById(req.params.id);
    return ok(res, { reading });
  } catch (error) {
    if (error.message === "ECG_READING_NOT_FOUND") {
      return notFound(res, error.message);
    }
    return serverErr(res, error);
  }
}

