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
    // Obtener todas las citas con sus triages y pacientes
    const appointments = await Appointment.findAll({
      include: [
        {
          model: ClinicalRegister,
          as: "clinicalRegister",
          required: true, // Solo citas que tengan triage
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
          required: false, // LEFT JOIN para verificar si no existe
        },
      ],
    });

    // Filtrar solo las citas que NO tengan sesiones ECG y que tengan paciente válido
    const eligibleAppointments = appointments.filter((apt) => {
      const hasNoSessions = !apt.ecgSessions || apt.ecgSessions.length === 0;
      const hasValidPatient = apt.patient && apt.patient.id;
      const hasValidClinicalRegister = apt.clinicalRegister && apt.clinicalRegister.id;
      return hasNoSessions && hasValidPatient && hasValidClinicalRegister;
    });

    // Obtener todos los dispositivos usando Sequelize
    const allDevices = await Device.findAll({
      attributes: ["id", "device_id", "name"],
      raw: true
    });

    // Mapear a formato simplificado con datos del paciente y su dispositivo asignado
    const result = eligibleAppointments.map((apt) => {
      const patientIdentification = String(apt.patient.identification || '');
      
      // Buscar dispositivo donde device_id coincida con patient_identification
      const assignedDevice = allDevices.find((device) => {
        // Comparar device_id (convertido a string) con patient_identification
        return String(device.device_id) === String(patientIdentification);
      });

      return {
        patient_id: apt.patient.id,
        patient_name: apt.patient.name || '',
        patient_last_name: apt.patient.last_name || '',
        patient_identification: patientIdentification,
        appointment_id: apt.id,
        clinical_register_id: apt.clinicalRegister.id,
        assigned_device: assignedDevice
          ? {
              id: assignedDevice.id,
              device_id: assignedDevice.device_id,
              name: assignedDevice.name,
            }
          : null,
        doctor: apt.doctor
          ? {
              id: apt.doctor.id,
              name: apt.doctor.name || '',
              last_name: apt.doctor.last_name || '',
              identification: apt.doctor.identification || '',
              email: apt.doctor.email || '',
            }
          : null,
      };
    });

    return result;
  } catch (e) {
    console.error("Error en getEligiblePatientsForSession:", e.message);
    throw e;
  }
}

