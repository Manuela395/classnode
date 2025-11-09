export const ok = (res, data = {}) => res.json({ ok: true, ...data });
export const created = (res, data = {}) =>
  res.status(201).json({ ok: true, ...data });
export const badReq = (res, msg = "VALIDATION_ERROR", details) =>
  res.status(400).json({ ok: false, error: msg, details });
export const unauthorized = (res, msg = "UNAUTHORIZED") =>
  res.status(401).json({ ok: false, error: msg });
export const conflict = (res, msg = "CONFLICT") =>
  res.status(409).json({ ok: false, error: msg });
export const serverErr = (res, e) =>
  res
    .status(500)
    .json({ ok: false, error: "SERVER_ERROR", details: e?.message });
export const notFound = (res, msg = "NOT_FOUND") =>
  res.status(404).json({ ok: false, error: msg });
export const forbidden = (res, msg = "FORBIDDEN") =>
  res.status(403).json({ ok: false, error: msg });
export const noContent = (res) => res.status(204).end();