import { Op } from "sequelize";
import { User, Role, UserRole } from "../models/index.js";
import { hash } from "../_helpers/password.js";
import { sign } from "../_helpers/jwt.js";

// Crear usuario con rol asignado
export async function createUser(data) {
  const {
    name,
    last_name,
    gender,
    birthdate,
    phone,
    identification,
    email,
    password,
    roles,
  } = data;

  // Validar si ya existe un usuario con el mismo email o identificación
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ email }, { identification }],
    },
  });
  if (existingUser) throw new Error("USER_EXISTS");

  // Normalizar el rol a minúsculas
  const rolesLower = roles.map((r) => r.toLowerCase());

  // Buscar el rol principal
  const role = await Role.findOne({ where: { code: rolesLower[0] } });
  if (!role) throw new Error("ROLE_NOT_FOUND");

  // Si el rol requiere contraseña, encriptarla
  let password_hash = null;
  const rolesRequierenPassword = ["admin", "admin_aux", "doc"];

  if (rolesRequierenPassword.includes(rolesLower[0])) {
    if (!password) throw new Error("PASSWORD_REQUIRED");
    password_hash = await hash(password);
  }

  // Crear usuario principal
  const newUser = await User.create({
    role_id: role.id,
    name,
    last_name,
    gender,
    birthdate,
    phone,
    identification,
    email,
    password_hash, // puede ser null si es paciente
    is_active: true,
  });

  // Registrar la relación en la tabla user_roles (aunque ya tenga role_id)
  await UserRole.create({
    user_id: newUser.id,
    role_id: role.id,
  });

  // ✅ Generar token JWT
  const token = sign({
    id: newUser.id,
    email: newUser.email,
    role: role.code,
  });

  // ✅ Retornar usuario y token
  return { user: newUser, token };
}

 // 🔹 Buscar usuario por login (email o identificación)
export async function findByLogin(login) {
  return await User.findOne({
    where: {
      [Op.or]: [{ email: login }, { identification: login }],
    },
    include: [
      {
        model: Role,
        as: "role",
        attributes: ["id", "code", "name"],
      },
    ],
  });
}



// 🔹 Listar todos los usuarios
export async function getAllUsers() {
  const users = await User.findAll({
    include: {
      model: Role,
      as: "role",
      attributes: ["id", "code", "name"],
    },
    attributes: [
      "id",
      "name",
      "last_name",
      "gender",
      "birthdate",
      "phone",
      "email",
      "identification",
      "is_active",
      "created_at",
      "updated_at",
    ],
  });
  return users;
}

// 🔹 Buscar usuario por ID
export async function getUserById(id) {
  const user = await User.findByPk(id, {
    include: {
      model: Role,
      as: "role",
      attributes: ["id", "code", "name"],
    },
  });
  if (!user) throw new Error("USER_NOT_FOUND");
  return user;
}

// 🔹 Actualizar usuario
export async function updateUser(id, data = {}) {
  const user = await User.findByPk(id);
  if (!user) throw new Error("USER_NOT_FOUND");

  // Si se envía un nuevo rol
  if (Array.isArray(data.roles) && data.roles.length > 0) {
    const role = await Role.findOne({ where: { code: data.roles[0] } });
    if (role) data.role_id = role.id;

    // 🔸 Validar contraseñas según el nuevo rol
    const rolesWithLogin = ["admin", "admin_aux", "doc"];
    if (rolesWithLogin.includes(role.code)) {
      if (data.password) {
        data.password_hash = await hash(data.password);
      } else if (!user.password_hash) {
        throw new Error("PASSWORD_REQUIRED");
      }
    } else {
      // Si el nuevo rol no requiere contraseña, la removemos
      data.password_hash = null;
    }
  }

  // Evitar actualizar directamente el campo `password`
  delete data.password;

  await user.update(data);
  return user;
}

// 🔹 Eliminar usuario
export async function deleteUser(id) {
  const user = await User.findByPk(id);
  if (!user) throw new Error("USER_NOT_FOUND");

  await user.destroy();
  return true;
}