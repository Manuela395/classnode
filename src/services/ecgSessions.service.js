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
    const appointments = await Appointment.findAll({
      include: [
        {
          model: ClinicalRegister,
          as: "clinicalRegister",
          required: true,
        },
        {
          model: User,
          as: "patient",
          attributes: ["id", "name", "last_name", "identification"],
        },
        {
          model: User,
          as: "doctor",
          attributes: ["id", "name", "last_name", "identification", "email"],
        },
        {
          model: ECGSession,
          as: "ecgSessions",
          required: false,
        },
      ],
    });

    const eligibleAppointments = appointments.filter((apt) => {
      const hasNoSessions = !apt.ecgSessions || apt.ecgSessions.length === 0;
      const hasPatient = Boolean(apt.patient && apt.patient.id);
      const hasClinicalRegister = Boolean(apt.clinicalRegister && apt.clinicalRegister.id);
      const hasDoctor = Boolean(apt.doctor && apt.doctor.id);
      return hasNoSessions && hasPatient && hasClinicalRegister && hasDoctor;
    });

    const allDevices = await Device.findAll({
      attributes: ["id", "device_id", "name"],
      raw: true,
    });

    const deviceByCode = new Map(allDevices.map((d) => [String(d.device_id), d]));

    return eligibleAppointments.map((apt) => {
      const patientIdentification = String(apt.patient.identification || "");
      const assignedDevice = deviceByCode.get(patientIdentification) || null;

      return {
        patient_id: apt.patient.id,
        patient_name: apt.patient.name || "",
        patient_last_name: apt.patient.last_name || "",
        patient_identification: patientIdentification,
        appointment_id: apt.id,
        clinical_register_id: apt.clinicalRegister.id,
        doctor: {
          id: apt.doctor.id,
          name: apt.doctor.name || "",
          last_name: apt.doctor.last_name || "",
          identification: apt.doctor.identification || "",
          email: apt.doctor.email || "",
        },
        assigned_device: assignedDevice
          ? {
              id: assignedDevice.id,
              device_id: assignedDevice.device_id,
              name: assignedDevice.name,
            }
          : null,
      };
    });
  } catch (e) {
    console.error("Error en getEligiblePatientsForSession:", e.message);
    throw e;
  }
}

export async function getActivePatientsForReadings() {
  try {
    const [sessions, allDevices] = await Promise.all([
      ECGSession.findAll({
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
                attributes: ["id", "name", "last_name", "identification"],
              },
              {
                model: User,
                as: "doctor",
                attributes: ["id", "name", "last_name", "identification", "email"],
              },
            ],
          },
          {
            model: Device,
            as: "device",
            attributes: ["id", "device_id", "name"],
            required: false,
          },
        ],
      }),
      Device.findAll({
        attributes: ["id", "device_id", "name"],
        raw: true,
      }),
    ]);

    const inactiveStatuses = ["stopped", "inactive", "closed", "finalized", "finalizada"];
    const deviceById = new Map(allDevices.map((d) => [d.id, d]));
    const deviceByCode = new Map(allDevices.map((d) => [String(d.device_id), d]));
    const uniquePatients = new Map();

    sessions.forEach((session) => {
      const statusRaw = (session.get?.("status") ?? session.status ?? "")
        .toString()
        .toLowerCase();
      if (statusRaw && inactiveStatuses.includes(statusRaw)) {
        return;
      }

      const appointment = session.appointment;
      const patient = appointment?.patient;
      const doctor = appointment?.doctor;
      const clinicalRegister = session.clinicalRegister;

      if (!patient?.id || !doctor?.id || !clinicalRegister?.id) {
        return;
      }

      let device = session.device ?? null;
      if (!device) {
        device =
          deviceById.get(session.device_id) ??
          deviceByCode.get(String(session.device_id)) ??
          null;
      }

      if (!device) {
        return;
      }

      if (!uniquePatients.has(patient.id)) {
        uniquePatients.set(patient.id, {
          patient_id: patient.id,
          patient_name: patient.name || "",
          patient_last_name: patient.last_name || "",
          patient_identification: String(patient.identification || ""),
          appointment_id: appointment.id,
          clinical_register_id: clinicalRegister.id,
          doctor: {
            id: doctor.id,
            name: doctor.name || "",
            last_name: doctor.last_name || "",
            identification: doctor.identification || "",
            email: doctor.email || "",
          },
          assigned_device: {
            id: device.id,
            device_id: device.device_id,
            name: device.name,
          },
          active_session: {
            id: session.id,
            status: statusRaw || null,
            lead_config: session.lead_config || null,
            sampling_hz: session.sampling_hz || null,
            device_id: session.device_id || null,
            started_at:
              (session.createdAt && session.createdAt.toISOString()) ||
              (session.created_at &&
                typeof session.created_at.toISOString === "function" &&
                session.created_at.toISOString()) ||
              null,
          },
        });
      }
    });

    return Array.from(uniquePatients.values());
  } catch (e) {
    console.error("Error en getActivePatientsForReadings:", e.message);
    throw e;
  }
}

