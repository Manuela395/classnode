// src/models/appointment.model.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Appointment = sequelize.define(
    "appointment",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      user_id_doctor: { type: DataTypes.UUID, allowNull: false }, // FK a users.id
      user_id_patient: { type: DataTypes.UUID, allowNull: false }, // FK a users.id
      date_appointment: { type: DataTypes.DATEONLY, allowNull: false },
      hour_appointment: { type: DataTypes.STRING(10), allowNull: true },
      status: { type: DataTypes.STRING(40), allowNull: true },
      place: { type: DataTypes.STRING(120), allowNull: true }, // consultorio / sitio
      notes: { type: DataTypes.TEXT, allowNull: true } // resumen breve
    },
    {
      tableName: "appointments",
      timestamps: true,
    }
  );

  return Appointment;
};

