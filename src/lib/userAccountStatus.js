/**
 * @param {Record<string, unknown> | undefined} d
 */
export function isUserAccountActive(d) {
  if (!d) return true;
  if (d.isSuspended === true) return false;
  const statusRaw = String(d.status ?? "active").toLowerCase();
  return statusRaw !== "inactive";
}

/** @param {boolean} active */
export function accountStatusPayload(active) {
  return {
    status: active ? "active" : "inactive",
    isSuspended: !active,
  };
}

/**
 * @param {Record<string, unknown> | undefined} d
 */
export function listRowStatusFromDoc(d) {
  return isUserAccountActive(d) ? "active" : "inactive";
}
