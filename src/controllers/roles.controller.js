// src/controllers/roles.controller.js
import {
  getAllRolesService,
  getRoleByIdService,
  createRoleService,
  updateRoleService,
  deleteRoleService
} from "../services/roles.service.js";
import { ok, created, badReq, notFound, serverErr } from "../_helpers/response_data.js";

export async function getAllRoles(req, res) {
  try {
    const roles = await getAllRolesService();
    return ok(res, { roles });
  } catch (e) {
    return serverErr(res, e);
  }
}

export async function getRoleById(req, res) {
  try {
    const role = await getRoleByIdService(req.params.id);
    if (!role) return notFound(res, "ROLE_NOT_FOUND");
    return ok(res, { role });
  } catch (e) {
    return serverErr(res, e);
  }
}

export async function createRole(req, res) {
  try {
    const newRole = await createRoleService(req.body);
    return created(res, { role: newRole });
  } catch (e) {
    return badReq(res, e.message);
  }
}

export async function updateRole(req, res) {
  try {
    const role = await updateRoleService(req.params.id, req.body);
    if (!role) return notFound(res, "ROLE_NOT_FOUND");
    return ok(res, { role });
  } catch (e) {
    return badReq(res, e.message);
  }
}

export async function deleteRole(req, res) {
  try {
    const deleted = await deleteRoleService(req.params.id);
    if (!deleted) return notFound(res, "ROLE_NOT_FOUND");
    return ok(res, { message: "Role deleted" });
  } catch (e) {
    return serverErr(res, e);
  }
}
