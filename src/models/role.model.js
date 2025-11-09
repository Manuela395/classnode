import { DataTypes } from "sequelize";
 
export default (sequelize) => {
  const Role = sequelize.define("role", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING(50), unique: true, allowNull: false }, // 'admin', 'user'
    name: { type: DataTypes.STRING(120), allowNull: false }
  }, { tableName: "roles" });
 
  return Role;
};