import {
  ok,
  created,
  badReq,
  conflict,
  notFound,
  serverErr,
  noContent,
} from "../_helpers/response_data.js";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../services/users.service.js";
import { registerSchema } from "../_helpers/validators.js";

// Registrar nuevo usuario
export async function registerController(req, res) {
  try {
    const { value, error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) return badReq(res, "VALIDATION", error.details);

    const { user, token } = await createUser(value);

    return created(res, { user, token });
  } catch (e) {
    if (e.message === "USER_EXISTS") return conflict(res, "USER_EXISTS");
    if (e.message === "ROLE_NOT_FOUND") return badReq(res, "ROLE_NOT_FOUND");
    if (e.message === "PASSWORD_REQUIRED") return badReq(res, "PASSWORD_REQUIRED");
    if (e.message === "INVALID_BIRTHDATE") return badReq(res, "INVALID_BIRTHDATE");
    return serverErr(res, e);
  }
}

// Listar usuarios
export async function getUsersController(req, res) {
  try {
    const users = await getAllUsers();
    return ok(res, { users });
  } catch (e) {
    return serverErr(res, e);
  }
}

// Obtener usuario por ID
export async function getUserController(req, res) {
  try {
    const user = await getUserById(req.params.id);
    return ok(res, { user });
  } catch (e) {
    if (e.message === "USER_NOT_FOUND") return notFound(res, "USER_NOT_FOUND");
    return serverErr(res, e);
  }
}

// Actualizar usuario
export async function updateUserController(req, res) {
  try {
    const user = await updateUser(req.params.id, req.body);
    return ok(res, { user });
  } catch (e) {
    if (e.message === "USER_NOT_FOUND") return notFound(res, "USER_NOT_FOUND");
    if (e.message === "PASSWORD_REQUIRED") return badReq(res, "PASSWORD_REQUIRED");
    if (e.message === "INVALID_BIRTHDATE") return badReq(res, "INVALID_BIRTHDATE");
    return serverErr(res, e);
  }
}

// Eliminar usuario
export async function deleteUserController(req, res) {
  try {
    await deleteUser(req.params.id);
    return noContent(res);
  } catch (e) {
    if (e.message === "USER_NOT_FOUND") return notFound(res, "USER_NOT_FOUND");
    return serverErr(res, e);
  }
}