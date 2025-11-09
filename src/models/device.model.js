// src/models/device.model.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Device = sequelize.define(
    "device",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      device_id: { type: DataTypes.INTEGER, unique: true, allowNull: false }, // 100,200,300...
      name: { type: DataTypes.STRING(160), allowNull: false },
      firmware: { type: DataTypes.STRING(120), allowNull: false },
      metadata: { type: DataTypes.JSON, allowNull: true }, // opcional: info adicional (modelo, serial, etc.)
    },
    {
      tableName: "devices",
      timestamps: true, // created_at, updated_at (underscored desde config global)
    }
  );

  return Device;
};
