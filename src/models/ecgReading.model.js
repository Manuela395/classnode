// src/models/ecgReading.model.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const ECGReading = sequelize.define(
    "ecg_reading",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      ecg_session_id: { type: DataTypes.INTEGER, allowNull: false }, // FK ecg_sessions.id
      record_count: { type: DataTypes.INTEGER, allowNull: false },
      observations: { type: DataTypes.TEXT, allowNull: true },
      data: { type: DataTypes.TEXT, allowNull: true }, // JSON o CSV con muestras o base64
      sample_rate: { type: DataTypes.INTEGER, allowNull: true },
      length_ms: { type: DataTypes.INTEGER, allowNull: true }, // duración de este segmento en ms (útil para validar <10s = 10000ms)
      attempt_number: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 1 } // si se repite la lectura
    },
    {
      tableName: "ecg_readings",
      timestamps: true,
    }
  );

  return ECGReading;
};

