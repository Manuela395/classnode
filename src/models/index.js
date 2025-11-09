import { sequelize } from "../_config/database.js";

import UserModel from "./user.model.js";
import RoleModel from "./role.model.js";
import UserRoleModel from "./userRole.model.js";
import AppointmentModel from "./appointment.model.js";
import ClinicalRegisterModel from "./clinicalRegister.model.js";
import ECGSessionModel from "./ecgSession.model.js";
import ECGReadingModel from "./ecgReading.model.js";
import AlertModel from "./alert.model.js";
import NoteModel from "./note.model.js";
import DeviceModel from "./device.model.js";

// ==============================
// Inicialización de modelos
// ==============================
export const Role = RoleModel(sequelize);
export const User = UserModel(sequelize);
export const UserRole = UserRoleModel(sequelize);
export const Appointment = AppointmentModel(sequelize);
export const ClinicalRegister = ClinicalRegisterModel(sequelize);
export const ECGSession = ECGSessionModel(sequelize);
export const ECGReading = ECGReadingModel(sequelize);
export const Alert = AlertModel(sequelize);
export const Note = NoteModel(sequelize);
export const Device = DeviceModel(sequelize);

// ==============================
// Relaciones principales
// ==============================

// 🔹 Roles ↔ Usuarios (rol principal)
Role.hasMany(User, {
  foreignKey: "role_id",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
  as: "users",
});
User.belongsTo(Role, {
  as: "role",
  foreignKey: "role_id",
});

// 🔹 Relación opcional: Roles secundarios (tabla intermedia user_roles)
User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: "user_id",
  otherKey: "role_id",
  as: "extraRoles",
});
Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: "role_id",
  otherKey: "user_id",
  as: "usersExtraRoles",
});

// ==============================
// Relaciones clínicas
// ==============================

// Usuarios ↔ Citas
User.hasMany(Appointment, {
  foreignKey: "user_id_doctor",
  as: "doctorAppointments",
  onDelete: "RESTRICT",
});
User.hasMany(Appointment, {
  foreignKey: "user_id_patient",
  as: "patientAppointments",
  onDelete: "RESTRICT",
});
Appointment.belongsTo(User, {
  as: "doctor",
  foreignKey: "user_id_doctor",
});
Appointment.belongsTo(User, {
  as: "patient",
  foreignKey: "user_id_patient",
});

// Citas ↔ Registros clínicos
Appointment.hasOne(ClinicalRegister, {
  foreignKey: "appointment_id",
  onDelete: "CASCADE",
  as: "clinicalRegister",
});
ClinicalRegister.belongsTo(Appointment, {
  foreignKey: "appointment_id",
  as: "appointment",
});

// Registros clínicos ↔ Sesiones ECG
ClinicalRegister.hasMany(ECGSession, {
  foreignKey: "clinical_register_id",
  onDelete: "CASCADE",
  as: "ecgSessions",
});
ECGSession.belongsTo(ClinicalRegister, {
  foreignKey: "clinical_register_id",
  as: "clinicalRegister",
});

// Dispositivos ↔ Sesiones ECG
Device.hasMany(ECGSession, {
  foreignKey: "device_id",
  onDelete: "RESTRICT",
  as: "ecgSessions",
});
ECGSession.belongsTo(Device, {
  foreignKey: "device_id",
  as: "device",
});

// Citas ↔ Sesiones ECG
Appointment.hasMany(ECGSession, {
  foreignKey: "appointment_id",
  onDelete: "CASCADE",
  as: "ecgSessions",
});
ECGSession.belongsTo(Appointment, {
  foreignKey: "appointment_id",
  as: "appointment",
});

// Sesiones ECG ↔ Lecturas
ECGSession.hasMany(ECGReading, {
  foreignKey: "ecg_session_id",
  onDelete: "CASCADE",
  as: "ecgReadings",
});
ECGReading.belongsTo(ECGSession, {
  foreignKey: "ecg_session_id",
  as: "ecgSession",
});

// Lecturas ↔ Alertas
ECGReading.hasMany(Alert, {
  foreignKey: "ecg_reading_id",
  onDelete: "CASCADE",
  as: "alerts",
});
Alert.belongsTo(ECGReading, {
  foreignKey: "ecg_reading_id",
  as: "ecgReading",
});

// Citas ↔ Notas
Appointment.hasMany(Note, {
  foreignKey: "appointment_id",
  onDelete: "CASCADE",
  as: "appointmentNotes",
});
Note.belongsTo(Appointment, {
  foreignKey: "appointment_id",
  as: "noteAppointment",
});

// ==============================
export { sequelize };
