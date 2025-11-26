import React from "react";
import { X } from "lucide-react";

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <>
      <div onClick={onCancel} className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
          <button onClick={onCancel} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end gap-4">
            <button onClick={onCancel} className="px-6 py-3 rounded-xl border border-gray-300 font-semibold hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={onConfirm} className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
