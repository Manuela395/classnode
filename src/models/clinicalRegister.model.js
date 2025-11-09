// src/models/clinicalRegister.model.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const ClinicalRegister = sequelize.define(
    "clinical_register",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      appointment_id: { type: DataTypes.INTEGER, allowNull: false }, // FK appointments.id
      smoker: { type: DataTypes.BOOLEAN, allowNull: true },
      drinker: { type: DataTypes.BOOLEAN, allowNull: true },
      congenital_diseases: { type: DataTypes.TEXT, allowNull: true },
      allergies: { type: DataTypes.TEXT, allowNull: true },
      height_cm: { type: DataTypes.INTEGER, allowNull: true },
      weight_kg: { type: DataTypes.INTEGER, allowNull: true },
      practice_sport: { type: DataTypes.BOOLEAN, allowNull: true },
      consult_type: { type: DataTypes.STRING(100), allowNull: true },
      summary: { type: DataTypes.TEXT, allowNull: true }
    },
    {
      tableName: "clinical_registers",
      timestamps: true,
    }
  );

  return ClinicalRegister;
};

