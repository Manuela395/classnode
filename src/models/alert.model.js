// src/models/alert.model.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Alert = sequelize.define(
    "alert",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      ecg_reading_id: { type: DataTypes.INTEGER, allowNull: false }, // FK ecg_readings.id
      type: { type: DataTypes.STRING(120), allowNull: false }, // tipo (bradicardia, taquicardia, artefacto, etc.)
      message: { type: DataTypes.TEXT, allowNull: true },
      severity: { type: DataTypes.STRING(30), allowNull: true } // low/medium/high
    },
    {
      tableName: "alerts",
      timestamps: true,
    }
  );

  return Alert;
};

