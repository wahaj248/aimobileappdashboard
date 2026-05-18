/** @param {unknown} v */
export function toDisplayDate(v) {
  if (v == null || typeof v !== "object") return null;
  const o = /** @type {{ toDate?: () => Date; type?: string; seconds?: number; nanoseconds?: number }} */ (v);
  if (typeof o.toDate === "function") {
    try {
      return o.toDate().toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return null;
    }
  }
  if (o.type === "firestore/timestamp/1.0" && typeof o.seconds === "number") {
    const ms = o.seconds * 1000 + (o.nanoseconds || 0) / 1e6;
    return new Date(ms).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }
  return null;
}

/** Deep-serialize for JSON preview (timestamps → locale / readable). */
export function deepSerializeForDisplay(input) {
  if (input == null) return input;
  if (typeof input !== "object") return input;
  const asDate = toDisplayDate(input);
  if (asDate) return asDate;
  if (Array.isArray(input)) return input.map((x) => deepSerializeForDisplay(x));
  const out = {};
  for (const [k, v] of Object.entries(input)) {
    out[k] = deepSerializeForDisplay(v);
  }
  return out;
}

/**
 * @param {string} key
 * @param {unknown} v
 */
export function formatFieldValue(key, v) {
  if (v === undefined || v === null || v === "") return "—";
  const dateStr = toDisplayDate(v);
  if (dateStr) return dateStr;
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (Array.isArray(v)) return v.length === 0 ? "—" : v.join(", ");
  if (typeof v === "object") return JSON.stringify(v);
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "—";
  if (typeof v === "string") {
    if (key === "fcmToken" && v.length > 36) return `${v.slice(0, 28)}… (${v.length} chars)`;
    return v;
  }
  return String(v);
}

export const PREVIEW_KEY_ORDER = [
  "name",
  "email",
  "status",
  "goal",
  "gender",
  "age",
  "height",
  "weight",
  "activityLevel",
  "trainingDays",
  "bmr",
  "tdee",
  "dailyCalories",
  "protein",
  "carbs",
  "fats",
  "fiber",
  "sugar",
  "dislikes",
  "medications",
  "allergies",
  "isOnboardingComplete",
  "isSuspended",
  "isDeleted",
  "lastActive",
  "createdAt",
  "fcmToken",
];

/**
 * @param {{ id: string } & Record<string, unknown>} detail
 */
export function getPreviewKeys(detail) {
  if (!detail?.id) return [];
  const keys = Object.keys(detail).filter((k) => k !== "id");
  const ordered = new Set(PREVIEW_KEY_ORDER);
  const first = PREVIEW_KEY_ORDER.filter((k) => keys.includes(k));
  const rest = keys.filter((k) => !ordered.has(k)).sort();
  return [...first, ...rest];
}
