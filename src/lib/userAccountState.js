/**
 * Active = not suspended and status is not "inactive".
 * @param {Record<string, unknown> | null | undefined} doc
 */
export function isUserAccountActive(doc) {
  if (doc?.isSuspended === true) return false;
  const status = String(doc?.status ?? "active").toLowerCase();
  return status !== "inactive";
}

/** @param {boolean} active */
export function accountFieldsForActive(active) {
  return {
    status: active ? "active" : "inactive",
    isSuspended: !active,
  };
}

/** @param {Record<string, unknown>} doc */
export function listRowFromUserDoc(doc, id) {
  const active = isUserAccountActive(doc);
  const fields = accountFieldsForActive(active);
  return {
    id,
    name: doc.name ?? doc.displayName ?? doc.fullName ?? "—",
    email: doc.email ?? "—",
    status: fields.status,
    isSuspended: fields.isSuspended,
  };
}
