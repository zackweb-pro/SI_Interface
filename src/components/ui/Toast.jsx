// src/components/ui/Toast.jsx
import React from "react";

export function Toast({ message, onClose, type = "success" }) {
  const backgroundColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white ${backgroundColor}`}
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 text-white">
          X
        </button>
      </div>
    </div>
  );
}
