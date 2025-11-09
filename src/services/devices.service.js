import { Device } from "../models/index.js";

export async function getAllDevices() {
  return await Device.findAll();
}

export async function getDeviceById(id) {
  const device = await Device.findByPk(id);
  if (!device) throw new Error("NOT_FOUND");
  return device;
}

export async function createDevice(data) {
  const exists = await Device.findOne({ where: { device_id: data.device_id } });
  if (exists) throw new Error("DEVICE_EXISTS");
  return await Device.create(data);
}

export async function updateDevice(id, data) {
  const device = await getDeviceById(id);
  await device.update(data);
  return device;
}

export async function deleteDevice(id) {
  const device = await getDeviceById(id);
  await device.destroy();
  return true;
}
