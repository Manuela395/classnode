import { ClinicalRegister } from "../models/index.js";

// Crear registro clínico
export async function createClinical(data) {
  return await ClinicalRegister.create(data);
}

// Obtener todos los registros clínicos
export async function getAllClinicals() {
  return await ClinicalRegister.findAll();
}

// Obtener un registro clínico por ID
export async function getClinicalById(id) {
  const record = await ClinicalRegister.findByPk(id);
  if (!record) throw new Error("CLINICAL_NOT_FOUND");
  return record;
}

// Actualizar registro clínico
export async function updateClinical(id, data) {
  const record = await ClinicalRegister.findByPk(id);
  if (!record) throw new Error("CLINICAL_NOT_FOUND");
  await record.update(data);
  return record;
}

// Eliminar registro clínico
export async function deleteClinical(id) {
  const record = await ClinicalRegister.findByPk(id);
  if (!record) throw new Error("CLINICAL_NOT_FOUND");
  await record.destroy();
  return true;
}
