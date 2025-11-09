// src/app.js
import express from "express";
import dotenv from "dotenv";
import { corsConfig } from "./_config/cors.js";
import apiRoutes from "./routes/index.routes.js";
import { sequelize, Role, User } from "./models/index.js";
import { hash } from "./_helpers/password.js";

dotenv.config();

const app = express();

app.use(corsConfig);
app.use(express.json());
app.use("/api", apiRoutes);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos establecida");

    // 🔹 Sincronizar modelos
    await sequelize.sync({ alter: true });
    console.log("Tablas sincronizadas correctamente");

    // 🔹 Crear roles base si no existen
    const baseRoles = [
      { code: "admin", name: "Administrador" },
      { code: "admin_aux", name: "Administrador Auxiliar" },
      { code: "doc", name: "Doctor" },
      { code: "pac", name: "Paciente" }, // Paciente = usuario sin acceso web
    ];

    for (const role of baseRoles) {
      await Role.findOrCreate({
        where: { code: role.code },
        defaults: { name: role.name },
      });
    }

    console.log("Roles base creados o actualizados correctamente");

    // 🔹 Crear usuario administrador inicial si no existe
    const existingAdmin = await User.findOne({
      where: { email: "admin@hospital.com" },
    });

    if (!existingAdmin) {
      const adminRole = await Role.findOne({ where: { code: "admin" } });
      const password_hash = await hash("admin123"); // Contraseña por defecto

      const adminUser = await User.create({
        role_id: adminRole.id,
        name: "Administrador Principal",
        last_name: "Del Sistema",
        email: "admin@hospital.com",
        identification: "0001",
        password_hash,
        is_active: true,
      });

      console.log("Usuario administrador inicial creado:", adminUser.email);
    } else {
      console.log("Usuario administrador ya existente.");
    }

  } catch (e) {
    console.error("Error de conexión o inicialización:", e.message);
  }
})();

export default app;
