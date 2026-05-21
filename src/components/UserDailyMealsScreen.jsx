import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";
import {
  loadAllUserDailyLogMeals,
  isDateKeyWithinLastNDays,
  formatDateKeyForDisplay,
} from "../lib/loadUserDailyLogMeals";

const DATE_FILTERS = [
  { id: "all", label: "All dates" },
  { id: "last3", label: "Last 3 days" },
  { id: "last7", label: "Last 7 days" },
];

/**
 * @param {{ id: string; name?: string; email?: string }} user
 */
export const UserDailyMealsScreen = ({ user, onClose }) => {
  const userId = user?.id;
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  const title = useMemo(
    () => String(user?.name || user?.email || "User").trim() || "User",
    [user?.name, user?.email]
  );

  const loadMeals = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const { meals: rows } = await loadAllUserDailyLogMeals(userId);
      setMeals(rows);
    } catch (e) {
      console.error("[daily meals UI]", e);
      setError(e?.message || String(e));
      setMeals([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  const filteredMeals = useMemo(() => {
    let list = meals;
    if (dateFilter === "last3") {
      list = list.filter((m) => isDateKeyWithinLastNDays(m.dateKey, 3));
    } else if (dateFilter === "last7") {
      list = list.filter((m) => isDateKeyWithinLastNDays(m.dateKey, 7));
    }
    if (!searchValue.trim()) return list;
    const q = searchValue.toLowerCase();
    return list.filter((m) => {
      const name = String(m.name ?? "").toLowerCase();
      const type = String(m.type ?? "").toLowerCase();
      const dk = String(m.dateKey ?? "").toLowerCase();
      const dkDisplay = formatDateKeyForDisplay(m.dateKey).toLowerCase();
      return name.includes(q) || type.includes(q) || dk.includes(q) || dkDisplay.includes(q);
    });
  }, [meals, searchValue, dateFilter]);

  const filterLabel = DATE_FILTERS.find((f) => f.id === dateFilter)?.label ?? "All dates";

  if (!userId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-slate-50">
      <header className="shrink-0 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 sm:h-auto sm:w-auto sm:gap-2 sm:px-3 sm:py-2"
          >
            <ArrowLeft size={18} className="text-slate-500" />
            <span className="hidden sm:inline text-sm font-medium">Back</span>
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg">Daily log meals</h1>
            <p className="truncate text-xs text-slate-500">
              {title}
              {!loading && meals.length > 0 && (
                <span>
                  {" "}
                  · {filteredMeals.length} shown
                  {filteredMeals.length !== meals.length ? ` of ${meals.length}` : ""} · {filterLabel}
                </span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={loadMeals}
            disabled={loading}
            aria-label="Refresh"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 sm:h-auto sm:w-auto sm:gap-2 sm:px-3 sm:py-2"
          >
            <RefreshCw size={18} className={loading ? "animate-spin text-indigo-600" : "text-slate-500"} />
            <span className="hidden sm:inline text-sm font-medium">Refresh</span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col px-3 sm:px-4 py-4">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col min-h-0">
          {error && (
            <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              type="text"
              placeholder="Search name, type, or date…"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full sm:max-w-xs border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex flex-wrap items-center gap-2">
              {DATE_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setDateFilter(f.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    dateFilter === f.id
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 py-20">
                <div className="h-9 w-9 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
                <p className="text-sm text-slate-500">Loading meals…</p>
              </div>
            ) : filteredMeals.length === 0 ? (
              <div className="flex items-center justify-center h-full py-20 text-sm text-slate-500 px-4 text-center">
                {meals.length === 0
                  ? "No meals found for this user."
                  : `No meals in range (${filterLabel}). Try All dates.`}
              </div>
            ) : (
              <div className="overflow-auto h-full">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Date
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Name
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Type
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMeals.map((m) => (
                      <tr key={`${m.dateKey}_${m.id}`} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap font-medium">
                          {formatDateKeyForDisplay(m.dateKey)}
                        </td>
                        <td className="px-4 py-3 text-slate-900 font-medium max-w-[220px]">
                          <span className="line-clamp-2">{m.name ?? "—"}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 capitalize whitespace-nowrap">{m.type ?? "—"}</td>
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{m.time ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
