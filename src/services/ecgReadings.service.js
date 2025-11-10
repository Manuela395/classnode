import { ECGReading, ECGSession, Appointment, User } from "../models/index.js";

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

export async function getAllECGReadings() {
  const readings = await ECGReading.findAll({
    include: [
      {
        model: ECGSession,
        as: "ecgSession",
        include: [
          {
            model: Appointment,
            as: "appointment",
            include: [
              { model: User, as: "patient" },
              { model: User, as: "doctor" },
            ],
          },
        ],
      },
    ],
    order: [["created_at", "DESC"]],
  });

  return readings.map((reading) => {
    const plain = reading.get({ plain: true });
    const session = plain.ecgSession;
    const appointment = session?.appointment;
    const patient = appointment?.patient;
    const doctor = appointment?.doctor;

    const createdAt =
      reading.get("createdAt") ??
      plain.created_at ??
      plain.createdAt ??
      null;

    return {
      id: plain.id,
      ecg_session_id: plain.ecg_session_id,
      record_count: plain.record_count,
      observations: plain.observations ?? "",
      created_at: createdAt,
      updated_at:
        reading.get("updatedAt") ?? plain.updated_at ?? plain.updatedAt ?? null,
      patient: patient
        ? {
            id: patient.id,
            name: patient.name ?? "",
            last_name: patient.last_name ?? "",
            identification: patient.identification ?? "",
          }
        : null,
      doctor: doctor
        ? {
            id: doctor.id,
            name: doctor.name ?? "",
            last_name: doctor.last_name ?? "",
            identification: doctor.identification ?? "",
            email: doctor.email ?? "",
          }
        : null,
      appointment: appointment
        ? {
            id: appointment.id,
          }
        : null,
    };
  });
}

