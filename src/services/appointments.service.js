import { Appointment, User } from "../models/index.js";

export async function getAllAppointments() {
  return await Appointment.findAll({
    include: [
      {
        model: User,
        as: "doctor",
        attributes: ["id", "name", "last_name", "identification", "email"],
      },
      {
        model: User,
        as: "patient",
        attributes: ["id", "name", "last_name", "identification", "email"],
      },
    ],
  });
}

export async function getAppointmentById(id) {
  const a = await Appointment.findByPk(id);
  if (!a) throw new Error("NOT_FOUND");
  return a;
}

export async function createAppointment(data) {
  return await Appointment.create(data);
}

export async function updateAppointment(id, data) {
  const a = await getAppointmentById(id);
  await a.update(data);
  return a;
}

export async function deleteAppointment(id) {
  const a = await getAppointmentById(id);
  await a.destroy();
  return true;
}
