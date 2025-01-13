import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const Toast = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  const backgroundColor = type === "success" ? "bg-green-500" : "bg-red-500";
  return (
    <div
      className={`${backgroundColor} text-white px-4 py-2 rounded fixed bottom-4 right-4 shadow-lg flex items-center justify-between z-50`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-sm font-bold bg-transparent border-none cursor-pointer"
      >
        <X />
      </button>
    </div>
  );
};

export default Toast;
