import { ok, created, badReq, notFound, serverErr } from "../_helpers/response_data.js";
import { createNote, getAllNotes, updateNote, deleteNote } from "../services/notes.service.js";

export async function createNoteController(req, res) {
  try {
    const note = await createNote(req.body);
    return created(res, { note });
  } catch (e) {
    if (e.message === "FIELDS_REQUIRED") return badReq(res, e.message);
    if (e.message === "APPOINTMENT_NOT_FOUND") return notFound(res, e.message);
    return serverErr(res, e);
  }
}

export async function getAllNotesController(_req, res) {
  try {
    const notes = await getAllNotes();
    return ok(res, { notes });
  } catch (e) {
    return serverErr(res, e);
  }
}

export async function updateNoteController(req, res) {
  try {
    const note = await updateNote(req.body);
    return ok(res, { note });
  } catch (e) {
    if (e.message === "ID_REQUIRED") return badReq(res, e.message);
    if (e.message === "NOTE_NOT_FOUND") return notFound(res, e.message);
    return serverErr(res, e);
  }
}

export async function deleteNoteController(req, res) {
  try {
    await deleteNote(req.params.id);
    return ok(res, { message: "NOTE_DELETED" });
  } catch (e) {
    if (e.message === "NOTE_NOT_FOUND") return notFound(res, e.message);
    return serverErr(res, e);
  }
}
