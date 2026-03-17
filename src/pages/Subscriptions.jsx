import React, { useEffect, useMemo, useState } from "react";
import { Eye, Pencil, Plus, RefreshCw, Smartphone, Trash2 } from "lucide-react";
import axiosInstance from "../Axios/axiosInstance";

const Subscriptions = () => {
  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewingSub, setViewingSub] = useState(null);
  const [editingSub, setEditingSub] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", expiry_date: "", featuresText: "" });

  const parseFeatures = (featuresText) => {
    const items = String(featuresText || "")
      .split(/\r?\n|,/g)
      .map((s) => s.trim())
      .filter(Boolean);
    return Array.from(new Set(items));
  };

  const featuresPreview = useMemo(() => parseFeatures(form.featuresText), [form.featuresText]);

  const normalizeExpiryDateInput = (value) => {
    if (!value) return "";
    const s = String(value);
    return s.includes("T") ? s.slice(0, 10) : s;
  };

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("subscriptions");
      setSubscriptions(Array.isArray(res?.data) ? res.data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const openAdd = () => {
    setEditingSub(null);
    setForm({ name: "", price: "", expiry_date: "", featuresText: "" });
    setShowModal(true);
  };

  const openView = (s) => setViewingSub(s);

  const openEdit = (s) => {
    setEditingSub(s);
    setForm({
      name: s.name ?? "",
      price: s.price ?? "",
      expiry_date: normalizeExpiryDateInput(s.expiry_date),
      featuresText: Array.isArray(s.features) ? s.features.join("\n") : "",
    });
    setShowModal(true);
  };

  const save = async () => {
    const payload = {
      name: form.name,
      price: form.price,
      features: parseFeatures(form.featuresText),
      expiry_date: form.expiry_date,
    };

    setLoading(true);
    try {
      if (editingSub?.id) {
        await axiosInstance.put(`subscriptions/${editingSub.id}`, payload);
      } else {
        await axiosInstance.post("subscriptions", payload);
      }
      setShowModal(false);
      await fetchSubscriptions();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (s) => {
    if (!window.confirm(`Delete subscription "${s.name}"?`)) return;
    setLoading(true);
    try {
      await axiosInstance.delete(`subscriptions/${s.id}`);
      await fetchSubscriptions();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Subscriptions</h1>
          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
            <Smartphone size={12} /> Manage subscription tiers shown on the mobile app.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchSubscriptions}
            disabled={loading}
            className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh"
          >
            <RefreshCw size={18} /> Refresh
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
          >
            <Plus size={18} /> Add Subscription
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase px-4 py-3">Name</th>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase px-4 py-3">Price</th>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase px-4 py-3">Expiry</th>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase px-4 py-3">Features</th>
              <th className="text-right text-xs font-semibold text-gray-600 uppercase px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subscriptions.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-sm text-gray-500" colSpan={5}>
                  {loading ? "Loading..." : "No subscriptions found."}
                </td>
              </tr>
            ) : (
              subscriptions.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{s.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.price}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {normalizeExpiryDateInput(s.expiry_date) || "-"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {Array.isArray(s.features) ? s.features.slice(0, 2).join(" · ") : "-"}
                    {Array.isArray(s.features) && s.features.length > 2 ? ` · +${s.features.length - 2} more` : ""}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openView(s)}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => openEdit(s)}
                      className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(s)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {viewingSub && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setViewingSub(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">View Subscription</h3>
            <div className="space-y-3 text-sm">
              <p>
                <span className="text-gray-500">Name:</span>{" "}
                <span className="font-medium">{viewingSub.name}</span>
              </p>
              <p>
                <span className="text-gray-500">Price:</span> {viewingSub.price}
              </p>
              <p>
                <span className="text-gray-500">Expiry date:</span>{" "}
                {normalizeExpiryDateInput(viewingSub.expiry_date) || "-"}
              </p>
              <div>
                <div className="text-gray-500 mb-1">Features:</div>
                <ul className="list-disc pl-5 space-y-1">
                  {(Array.isArray(viewingSub.features) ? viewingSub.features : []).map((f, idx) => (
                    <li key={idx} className="text-gray-700">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              onClick={() => setViewingSub(null)}
              className="mt-6 w-full border rounded-lg py-2 text-sm text-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {editingSub ? "Edit Subscription" : "Add Subscription"}
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name (e.g. Free)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder='Price (e.g. "$0 / forever")'
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="date"
                value={form.expiry_date}
                onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
              <div>
                <textarea
                  rows={5}
                  placeholder={"Features (one per line)\nAccess to all 3 play modes\nBasic music categories"}
                  value={form.featuresText}
                  onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
                <div className="mt-2 text-xs text-gray-500">Parsed features: {featuresPreview.length}</div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border rounded-lg py-2 text-sm text-gray-600"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="flex-1 bg-indigo-600 text-white rounded-lg py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
