import { Note, Appointment } from "../models/index.js";

export async function createNote({ appointment_id, description }) {
  if (!appointment_id || !description) throw new Error("FIELDS_REQUIRED");
  const appt = await Appointment.findByPk(appointment_id);
  if (!appt) throw new Error("APPOINTMENT_NOT_FOUND");
  const n = await Note.create({ appointment_id, description });
  return n.toJSON();
}

export async function getAllNotes() {
  return (await Note.findAll({ order: [["id","ASC"]] })).map((n) => n.toJSON());
}

export async function updateNote({ id, description }) {
  if (!id) throw new Error("ID_REQUIRED");
  const n = await Note.findByPk(id);
  if (!n) throw new Error("NOTE_NOT_FOUND");
  if (description !== undefined) n.description = description;
  await n.save();
  return n.toJSON();
}

export async function deleteNote(id) {
  const n = await Note.findByPk(id);
  if (!n) throw new Error("NOTE_NOT_FOUND");
  await n.destroy();
  return true;
}
