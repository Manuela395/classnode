import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
 
export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false, // pon true si quieres ver SQL la consulta que le enviamos
    define: { underscored: true, freezeTableName: true } //snake_case para las tablas // no pluraliza conserva el nombre que le doy a las tablas
  }
);