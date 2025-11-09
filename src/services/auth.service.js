import { compare } from "../_helpers/password.js";
import { sign } from "../_helpers/jwt.js";
import { findByLogin } from "./users.service.js";

export async function loginService({ login, password }) {
  const user = await findByLogin(login);
  if (!user) throw new Error("INVALID_CREDENTIALS");

  const rolesRequierenPassword = ["admin", "admin_aux", "doc"];

  // Validar contraseña solo si el rol la requiere
  if (rolesRequierenPassword.includes(user.role.code)) {
    const ok = await compare(password, user.password_hash);
    if (!ok) throw new Error("INVALID_CREDENTIALS");
  }

  const payload = {
    id: user.id,
    email: user.email,
    identification: user.identification,
    name: user.name,
    role: user.role?.code, // Usar el rol principal del usuario
  };

  const token = sign(payload);

  // Crear versión segura del usuario sin contraseña
  const safe = typeof user.toJSON === "function" ? user.toJSON() : { ...user };
  delete safe.password_hash;

  if (safe.roles?.forEach) {
    safe.roles.forEach((r) => {
      if (r?.UserRole) delete r.UserRole;
    });
  }

  return { token, user: safe };
}
