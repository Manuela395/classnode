// src/models/ecgSession.model.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const ECGSession = sequelize.define(
    "ecg_session",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      appointment_id: { type: DataTypes.INTEGER, allowNull: false }, // FK appointments.id
      clinical_register_id: { type: DataTypes.INTEGER, allowNull: false }, // FK clinical_registers.id
      device_id: { type: DataTypes.INTEGER, allowNull: false }, // FK devices.id
      sampling_hz: { type: DataTypes.INTEGER, allowNull: true },
      lead_config: { type: DataTypes.STRING(100), allowNull: true },
      session_type: { type: DataTypes.STRING(60), allowNull: true }, // e.g. "consultorio", "a_domicilio"
      duration_ms: { type: DataTypes.INTEGER, allowNull: true }, // duración total estimada en ms
      notes: { type: DataTypes.TEXT, allowNull: true }
    },
    {
      tableName: "ecg_sessions",
      timestamps: true,
    }
  );

  return ECGSession;
};

