import { Role } from "../models/index.js";

export async function getAllRolesService() {
  return await Role.findAll();
}

export async function getRoleByIdService(id) {
  return await Role.findByPk(id);
}

export async function createRoleService(data) {
  return await Role.create(data);
}

export async function updateRoleService(id, data) {
  const role = await Role.findByPk(id);
  if (!role) return null;
  await role.update(data);
  return role;
}

export async function deleteRoleService(id) {
  const role = await Role.findByPk(id);
  if (!role) return null;
  await role.destroy();
  return role;
}
