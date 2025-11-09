// src/models/user.model.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false, // cada usuario debe tener un rol base
      },
      identification: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(160),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: DataTypes.STRING(200),
        allowNull: true, // ✅ ahora puede ser null para pacientes
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(120),
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "users",
      timestamps: false, // desactivamos timestamps automáticos porque los manejamos manualmente
      underscored: true,
    }
  );

  return User;
};
