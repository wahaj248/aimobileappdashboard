import { collection, collectionGroup, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function addDays(base, deltaDays) {
  const d = new Date(base);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + deltaDays);
  return d;
}

function dateIdsFromCalendarScan(daysBack = 120) {
  const ids = [];
  const seen = new Set();
  const now = new Date();
  for (let i = 0; i <= daysBack; i++) {
    const d = addDays(now, -i);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const a = `${y}-${m}-${day}`;
    const b = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (!seen.has(a)) {
      seen.add(a);
      ids.push(a);
    }
    if (!seen.has(b)) {
      seen.add(b);
      ids.push(b);
    }
  }
  return ids;
}

function pushMealsFromArray(rows, seen, dateId, mealsArr, source) {
  for (let i = 0; i < mealsArr.length; i++) {
    const item = mealsArr[i];
    const o = typeof item === "object" && item !== null ? item : { value: item };
    const id = String(o.id ?? `meal_${i}`);
    const k = `${dateId}_${id}`;
    if (seen.has(k)) continue;
    seen.add(k);
    rows.push({ id, dateKey: dateId, _source: source, ...o });
  }
}

/**
 * User path: users/{userId}/daily_logs/meals/{dateId}/[list of meals]
 * - meals = document under daily_logs
 * - {dateId} = subcollection → each child doc = one meal
 * OR {dateId} = document with meals[] field
 */
async function loadMealsPrimaryPath(userId, dateId) {
  const label = `users/${userId}/daily_logs/meals/${dateId}`;
  const rows = [];
  console.group(`[PATH meals>${dateId}] ${label}`);

  try {
    const colSnap = await getDocs(
      collection(db, "users", userId, "daily_logs", "meals", dateId)
    );
    console.log(`→ subcollection [${label}] doc count:`, colSnap.size);
    for (let i = 0; i < colSnap.docs.length; i++) {
      const docSnap = colSnap.docs[i];
      const data = docSnap.data();
      console.log(`  meal[${i}] id=${docSnap.id}`, data);
      rows.push({
        id: docSnap.id,
        dateKey: dateId,
        _source: label + "/{mealDoc}",
        ...data,
      });
    }
  } catch (e) {
    console.warn(`→ subcollection failed:`, e?.code, e?.message);
  }

  try {
    const dateDoc = await getDoc(doc(db, "users", userId, "daily_logs", "meals", dateId));
    console.log(`→ date document exists:`, dateDoc.exists());
    if (dateDoc.exists()) {
      const data = dateDoc.data() || {};
      console.log(`→ date document data:`, data);
      if (Array.isArray(data.meals)) {
        console.log(`→ meals[] length:`, data.meals.length, data.meals);
        const seen = new Set();
        pushMealsFromArray(rows, seen, dateId, data.meals, label + ".meals[]");
      } else if (rows.length === 0) {
        rows.push({
          id: dateDoc.id,
          dateKey: dateId,
          _source: label + " (single doc)",
          ...data,
        });
      }
    }
  } catch (e) {
    console.warn(`→ date document failed:`, e?.code, e?.message);
  }

  console.groupEnd();
  return rows;
}

/**
 * meals = collection under daily_logs/{parentDoc}/meals/{dateId}
 */
async function loadMealsAsCollectionDateDoc(userId, dateId, parentDocId) {
  const label = `users/${userId}/daily_logs/${parentDocId}/meals/${dateId}`;
  const rows = [];
  console.group(`[PATH alt] ${label}`);

  try {
    const snap = await getDoc(doc(db, "users", userId, "daily_logs", parentDocId, "meals", dateId));
    console.log("→ date doc exists:", snap.exists(), snap.exists() ? snap.data() : null);
    if (snap.exists()) {
      const data = snap.data() || {};
      if (Array.isArray(data.meals)) {
        const seen = new Set();
        pushMealsFromArray(rows, seen, dateId, data.meals, label + ".meals[]");
      } else {
        rows.push({ id: snap.id, dateKey: dateId, _source: label, ...data });
      }
    }
  } catch (e) {
    console.warn("→ getDoc failed:", e?.message);
  }

  try {
    const colSnap = await getDocs(
      collection(db, "users", userId, "daily_logs", parentDocId, "meals", dateId)
    );
    console.log("→ subcollection count:", colSnap.size);
    for (const docSnap of colSnap.docs) {
      console.log(`  meal id=${docSnap.id}`, docSnap.data());
      rows.push({
        id: docSnap.id,
        dateKey: dateId,
        _source: label + "/{mealDoc}",
        ...docSnap.data(),
      });
    }
  } catch (e) {
    console.warn("→ subcollection failed:", e?.message);
  }

  console.groupEnd();
  return rows;
}

/** List date doc ids from daily_logs/{parent}/meals collection */
async function discoverDateIdsFromMealsCollection(userId) {
  const dateIds = [];
  const parentIds = new Set(["meals"]);

  try {
    const dailyLogsSnap = await getDocs(collection(db, "users", userId, "daily_logs"));
    for (const d of dailyLogsSnap.docs) parentIds.add(d.id);
    console.info(
      "[daily_log meals] daily_logs parent doc ids:",
      dailyLogsSnap.docs.map((x) => x.id)
    );

    for (const parentId of parentIds) {
      try {
        const mealsCol = await getDocs(
          collection(db, "users", userId, "daily_logs", parentId, "meals")
        );
        if (mealsCol.empty) continue;
        console.log(
          `[daily_log meals] collection users/.../daily_logs/${parentId}/meals — ${mealsCol.size} date docs`
        );
        for (const d of mealsCol.docs) {
          dateIds.push(d.id);
          const data = d.data();
          console.log(`  date doc [${d.id}]`, data);
          if (Array.isArray(data.meals)) {
            console.log(`  date [${d.id}] meals[]:`, data.meals);
          }
        }
      } catch {
        /* parent may not have meals subcollection */
      }
    }
  } catch (e) {
    console.warn("[daily_log meals] discover dates:", e);
  }

  return dateIds;
}

async function loadMealsViaCollectionGroup(userId) {
  const prefix = `users/${userId}/daily_logs/`;
  const rows = [];
  try {
    const snap = await getDocs(collectionGroup(db, "meals"));
    for (const docSnap of snap.docs) {
      if (!docSnap.ref.path.startsWith(prefix)) continue;
      const parts = docSnap.ref.path.split("/");
      const dlIx = parts.indexOf("daily_logs");
      const dateKey = dlIx >= 0 ? parts[dlIx + 2] ?? parts[dlIx + 1] : "";
      console.log("[collectionGroup meals]", docSnap.ref.path, docSnap.data());
      rows.push({
        id: docSnap.id,
        dateKey,
        _source: "collectionGroup:meals",
        _path: docSnap.ref.path,
        ...docSnap.data(),
      });
    }
  } catch (e) {
    console.warn("[daily_log meals] collectionGroup:", e);
  }
  return rows;
}

/**
 * Load all daily log meals — all dates, console per path.
 */
export async function loadAllUserDailyLogMeals(userId) {
  console.info("[daily_log meals] ========== START ==========", { userId });

  const dateIds = new Set();

  for (const id of await discoverDateIdsFromMealsCollection(userId)) dateIds.add(id);
  for (const id of dateIdsFromCalendarScan(120)) dateIds.add(id);

  const foldersToLoad = [...dateIds];
  console.info("[daily_log meals] dates to try:", foldersToLoad.length, foldersToLoad.slice(0, 15));

  const all = [];
  const byDate = {};
  const seen = new Set();

  const CHUNK = 8;
  for (let i = 0; i < foldersToLoad.length; i += CHUNK) {
    const slice = foldersToLoad.slice(i, i + CHUNK);
    await Promise.all(
      slice.map(async (dateId) => {
        let rows = await loadMealsPrimaryPath(userId, dateId);

        if (rows.length === 0) {
          rows = await loadMealsAsCollectionDateDoc(userId, dateId, "meals");
        }

        if (rows.length > 0) {
          byDate[dateId] = rows;
          for (const row of rows) {
            const k = `${row.dateKey}_${row.id}`;
            if (seen.has(k)) continue;
            seen.add(k);
            all.push(row);
          }
        }
      })
    );
  }

  if (all.length === 0) {
    const cg = await loadMealsViaCollectionGroup(userId);
    for (const row of cg) {
      const dk = row.dateKey || "unknown";
      if (!byDate[dk]) byDate[dk] = [];
      byDate[dk].push(row);
      const k = `${dk}_${row.id}`;
      if (!seen.has(k)) {
        seen.add(k);
        all.push(row);
      }
    }
  }

  const uniqueDates = Object.keys(byDate).sort();

  console.log("[daily_log meals] ========== SUMMARY ==========", {
    userId,
    totalMeals: all.length,
    daysWithMeals: uniqueDates.length,
    dates: uniqueDates,
  });

  for (const dateKey of uniqueDates) {
    console.log(`[daily_log meals] ★ ${dateKey} — meals list:`, byDate[dateKey]);
  }

  if (all.length === 0) {
    console.log("[daily_log meals] no meals — open groups above for per-path errors");
  } else {
    console.log("[daily_log meals] flat list:", all);
  }

  return { meals: all, byDate, dateFolderCount: uniqueDates.length };
}
