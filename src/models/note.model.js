// src/models/note.model.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Note = sequelize.define(
    "note",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      appointment_id: { type: DataTypes.INTEGER, allowNull: false }, // FK appointments.id
      description: { type: DataTypes.TEXT, allowNull: false },
      author_user_id: { type: DataTypes.UUID, allowNull: true }, // opcional: quién registró la nota (doctor)
    },
    {
      tableName: "notes",
      timestamps: true,
    }
  );

  return Note;
};

