import { ECGSession, ClinicalRegister, Appointment, Device, User } from "../models/index.js";

export async function getAllECGSessions() {
  return await ECGSession.findAll({
    include: [
      { model: ClinicalRegister, as: "clinicalRegister" },
      {
        model: Appointment,
        as: "appointment",
        include: [
          { model: User, as: "patient" },
          { model: User, as: "doctor" },
        ],
      },
      { model: Device, as: "device" },
    ],
  });
}

export async function getECGSessionById(id) {
  const s = await ECGSession.findByPk(id, {
    include: [
      { model: ClinicalRegister, as: "clinicalRegister" },
      {
        model: Appointment,
        as: "appointment",
        include: [
          { model: User, as: "patient" },
          { model: User, as: "doctor" },
        ],
      },
      { model: Device, as: "device" },
    ],
  });
  if (!s) throw new Error("NOT_FOUND");
  return s;
}

export async function createECGSession(data) {
  // Validar campos requeridos
  if (!data.device_id || !data.appointment_id || !data.clinical_register_id) {
    throw new Error("FIELDS_REQUIRED");
  }
  
  const created = await ECGSession.create(data);
  return await getECGSessionById(created.id);
}

export async function updateECGSession(id, data) {
  if (!id) throw new Error("ID_REQUIRED");
  const s = await ECGSession.findByPk(id);
  if (!s) throw new Error("ECG_SESSION_NOT_FOUND");
  await s.update(data);
  return await getECGSessionById(id);
}

export async function deleteECGSession(id) {
  const s = await getECGSessionById(id);
  await s.destroy();
  return true;
}

export async function getEligiblePatientsForSession() {
  try {
    const sessions = await ECGSession.findAll({
      include: [
        {
          model: ClinicalRegister,
          as: "clinicalRegister",
          required: true,
        },
        {
          model: Appointment,
          as: "appointment",
          required: true,
          include: [
            {
              model: User,
              as: "patient",
              required: true,
              attributes: ["id", "name", "last_name", "identification"],
            },
            {
              model: User,
              as: "doctor",
              required: true,
              attributes: ["id", "name", "last_name", "identification", "email"],
            },
          ],
        },
        {
          model: Device,
          as: "device",
          required: true,
          attributes: ["id", "device_id", "name"],
        },
      ],
    });

    const activeSessions = sessions.filter((session) => {
      const status = (session.status || "").toLowerCase();
      const isActive =
        !status || ["active", "recording", "in_progress"].includes(status);
      const appointment = session.appointment;
      const patient = appointment?.patient;
      const doctor = appointment?.doctor;
      const device = session.device;

      return (
        isActive &&
        Boolean(patient?.id) &&
        Boolean(doctor?.id) &&
        Boolean(device?.id)
      );
    });

    const result = activeSessions.map((session) => {
      const appointment = session.appointment;
      const patient = appointment?.patient;
      const doctor = appointment?.doctor;
      const device = session.device;

      return {
        session_id: session.id,
        session_status: session.status || null,
        patient_id: patient?.id ?? null,
        patient_name: patient?.name || "",
        patient_last_name: patient?.last_name || "",
        patient_identification: String(patient?.identification || ""),
        appointment_id: appointment?.id ?? null,
        clinical_register_id:
          session.clinical_register_id ??
          session.clinicalRegister?.id ??
          appointment?.clinicalRegister?.id ??
          null,
        assigned_device: {
          id: device?.id ?? null,
          device_id: device?.device_id ?? null,
          name: device?.name || "",
        },
        doctor: {
          id: doctor?.id ?? null,
          name: doctor?.name || "",
          last_name: doctor?.last_name || "",
          identification: doctor?.identification || "",
          email: doctor?.email || "",
        },
      };
    });

    return result;
  } catch (e) {
    console.error("Error en getEligiblePatientsForSession:", e.message);
    throw e;
  }
}

