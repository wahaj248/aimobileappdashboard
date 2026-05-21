import React, { useCallback, useMemo, useState } from "react";
import { Eye, Pencil, RefreshCw, Trash2 } from "lucide-react";

const DUMMY_KEYWORDS = [
  {
    id: "kw_001",
    keyword: "grilled chicken salad",
    category: "Meals",
    status: "active",
    searchHits: 1240,
    updatedAt: "2026-03-12",
  },
  {
    id: "kw_002",
    keyword: "high protein breakfast",
    category: "Meals",
    status: "active",
    searchHits: 982,
    updatedAt: "2026-03-10",
  },
  {
    id: "kw_003",
    keyword: "low carb dinner",
    category: "Diet",
    status: "active",
    searchHits: 756,
    updatedAt: "2026-03-08",
  },
  {
    id: "kw_004",
    keyword: "caramel latte calories",
    category: "Drinks",
    status: "inactive",
    searchHits: 412,
    updatedAt: "2026-02-28",
  },
  {
    id: "kw_005",
    keyword: "greek yogurt snack",
    category: "Snacks",
    status: "active",
    searchHits: 638,
    updatedAt: "2026-03-01",
  },
  {
    id: "kw_006",
    keyword: "meal prep ideas",
    category: "General",
    status: "inactive",
    searchHits: 289,
    updatedAt: "2026-02-15",
  },
  {
    id: "kw_007",
    keyword: "vegan lunch bowl",
    category: "Meals",
    status: "active",
    searchHits: 521,
    updatedAt: "2026-03-05",
  },
  {
    id: "kw_008",
    keyword: "intermittent fasting",
    category: "Diet",
    status: "active",
    searchHits: 1103,
    updatedAt: "2026-03-11",
  },
];

function cloneDummyRows() {
  return DUMMY_KEYWORDS.map((row) => ({ ...row }));
}

const SearchKeywords = () => {
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState(() => cloneDummyRows());
  const [searchValue, setSearchValue] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchKeywords = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setKeywords(cloneDummyRows());
      setLoading(false);
    }, 400);
  }, []);

  const filteredKeywords = useMemo(() => {
    let list = keywords;
    if (filter === "active") list = list.filter((k) => k.status === "active");
    if (filter === "inactive") list = list.filter((k) => k.status === "inactive");
    if (!searchValue.trim()) return list;
    const q = searchValue.toLowerCase();
    return list.filter(
      (k) =>
        k.keyword.toLowerCase().includes(q) ||
        k.category.toLowerCase().includes(q) ||
        k.id.toLowerCase().includes(q)
    );
  }, [keywords, searchValue, filter]);

  const handleView = (row) => {
    window.alert(
      `Keyword: ${row.keyword}\nCategory: ${row.category}\nStatus: ${row.status}\nSearch hits: ${row.searchHits}\nUpdated: ${row.updatedAt}\nID: ${row.id}`
    );
  };

  const handleEdit = (row) => {
    const next = window.prompt("Edit keyword text:", row.keyword);
    if (next == null || !next.trim()) return;
    setKeywords((prev) =>
      prev.map((k) => (k.id === row.id ? { ...k, keyword: next.trim(), updatedAt: "2026-03-19" } : k))
    );
  };

  const handleDelete = (row) => {
    if (!window.confirm(`Remove keyword "${row.keyword}"? (sample data only)`)) return;
    setKeywords((prev) => prev.filter((k) => k.id !== row.id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Search Keywords</h1>
        <button
          type="button"
          onClick={fetchKeywords}
          disabled={loading}
          className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-50 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh"
        >
          <RefreshCw size={18} className={loading ? "animate-spin text-indigo-600" : ""} />
          Refresh
        </button>
      </div>

      <div className="mb-4 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
        Showing <strong>sample data</strong> for preview. Live Firestore keywords will be wired in a later update.
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
          <input
            type="text"
            placeholder="Search by keyword or category..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full md:max-w-md border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                filter === "all" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter("active")}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                filter === "active" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setFilter("inactive")}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                filter === "inactive" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Inactive
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-4">
                  #
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-4">
                  Keyword
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-4">
                  Category
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-4">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-4">
                  Search hits
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-4">
                  Updated
                </th>
                <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredKeywords.length > 0 ? (
                filteredKeywords.map((row, index) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{row.keyword}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{row.category}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          row.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 tabular-nums">
                      {row.searchHits.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{row.updatedAt}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleEdit(row)}
                          disabled={loading}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition disabled:opacity-50"
                          title="Edit (sample)"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleView(row)}
                          disabled={loading}
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
                          title="View details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row)}
                          disabled={loading}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                          title="Delete (sample)"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">
                    {loading ? "Loading…" : "No keywords match your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SearchKeywords;
