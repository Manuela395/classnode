import { ECGReading, ECGSession } from "../models/index.js";

const REQUIRED_ERROR = "FIELDS_REQUIRED";
const INVALID_SESSION_ERROR = "INVALID_SESSION_ID";
const INVALID_RECORD_COUNT_ERROR = "INVALID_RECORD_COUNT";
const SESSION_NOT_FOUND_ERROR = "ECG_SESSION_NOT_FOUND";

export async function createECGReading(payload = {}) {
  const { ecg_session_id, record_count, observations } = payload;

  if (
    ecg_session_id === undefined ||
    ecg_session_id === null ||
    record_count === undefined ||
    record_count === null
  ) {
    throw new Error(REQUIRED_ERROR);
  }

  const sessionId = Number(ecg_session_id);
  if (!Number.isInteger(sessionId) || sessionId <= 0) {
    throw new Error(INVALID_SESSION_ERROR);
  }

  const count = Number(record_count);
  if (!Number.isInteger(count) || count <= 0) {
    throw new Error(INVALID_RECORD_COUNT_ERROR);
  }

  const session = await ECGSession.findByPk(sessionId);
  if (!session) {
    throw new Error(SESSION_NOT_FOUND_ERROR);
  }

  let trimmedObservations = null;
  if (typeof observations === "string") {
    trimmedObservations = observations.trim();
  } else if (observations !== undefined && observations !== null) {
    trimmedObservations = observations;
  }

  const reading = await ECGReading.create({
    ecg_session_id: sessionId,
    record_count: count,
    observations: trimmedObservations,
  });

  return reading.get({ plain: true });
}

export const ECG_READING_ERRORS = {
  REQUIRED_ERROR,
  INVALID_SESSION_ERROR,
  INVALID_RECORD_COUNT_ERROR,
  SESSION_NOT_FOUND_ERROR,
};

