import { Alert, ECGReading } from "../models/index.js";

export async function createAlert({ ecg_reading_id, type, message }) {
  if (!ecg_reading_id || !type || !message) throw new Error("FIELDS_REQUIRED");
  const reading = await ECGReading.findByPk(ecg_reading_id);
  if (!reading) throw new Error("ECG_READING_NOT_FOUND");

  const a = await Alert.create({ ecg_reading_id, type, message });
  return a.toJSON();
}

export async function getAllAlerts() {
  return (await Alert.findAll({ order: [["id","ASC"]] })).map((a) => a.toJSON());
}

export async function updateAlert({ id, type, message }) {
  if (!id) throw new Error("ID_REQUIRED");
  const a = await Alert.findByPk(id);
  if (!a) throw new Error("ALERT_NOT_FOUND");
  if (type !== undefined) a.type = type;
  if (message !== undefined) a.message = message;
  await a.save();
  return a.toJSON();
}

export async function deleteAlert(id) {
  const a = await Alert.findByPk(id);
  if (!a) throw new Error("ALERT_NOT_FOUND");
  await a.destroy();
  return true;
}
