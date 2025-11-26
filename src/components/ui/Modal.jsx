import React from "react";
import { X } from "lucide-react";

export default function Modal({ title, message, onConfirm, onCancel }) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onCancel}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
      />

      {/* Modal Box */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-md p-6 relative">
          {/* Close button */}
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>

          {/* Message */}
          <p className="text-gray-600 mb-6">{message}</p>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              onClick={onCancel}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
