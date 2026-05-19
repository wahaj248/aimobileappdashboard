import React, { useEffect, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { formatFieldValue, getPreviewKeys } from "../lib/userDocumentDisplay";

/**
 * Full-screen read-only user document (no modal card / no raw JSON).
 * @param {{ id: string } & Record<string, unknown>} detail
 */
export const ViewUserModal = ({ detail, onClose }) => {
  const docId = detail?.id;
  const displayName = String(detail?.name ?? detail?.displayName ?? "User details");

  const rowKeys = useMemo(() => {
    if (!docId) return [];
    const rest = getPreviewKeys(detail).filter((k) => k !== "id");
    return ["id", ...rest];
  }, [detail, docId]);

  useEffect(() => {
    if (docId) console.log("[ViewUserScreen] full user document:", detail);
  }, [detail, docId]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (!docId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-gray-50">
      <header className="shrink-0 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft size={18} className="text-gray-500" />
          Back
        </button>
        <h1 className="text-lg font-semibold text-gray-900 truncate">{displayName}</h1>
      </header>

      <main className="flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-4xl px-4 py-6 pb-12">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <dl className="grid grid-cols-1 sm:grid-cols-[minmax(9rem,12rem)_1fr] divide-y divide-gray-100 text-sm sm:divide-y-0">
              {rowKeys.map((key) => (
                <React.Fragment key={key}>
                  <dt className="border-gray-100 bg-gray-50 px-4 py-3 text-xs font-medium text-gray-600 sm:border-b sm:border-r">
                    {key === "height" ? "Height" : key === "id" ? "User ID" : key}
                  </dt>
                  <dd className="border-gray-100 px-4 py-3 text-gray-900 break-words sm:border-b">
                    {key === "id" ? (
                      <span className="font-mono text-xs text-gray-800">{docId}</span>
                    ) : (
                      formatFieldValue(key, detail[key])
                    )}
                  </dd>
                </React.Fragment>
              ))}
            </dl>
          </div>
        </div>
      </main>
    </div>
  );
};
