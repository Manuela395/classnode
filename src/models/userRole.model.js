import { DataTypes } from "sequelize";

export default (sequelize) => {
  const UserRole = sequelize.define("user_role", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }
  }, { tableName: "user_roles" });

  return UserRole;
};