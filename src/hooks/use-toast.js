// src/hooks/use-toast.js
import { useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const newToast = { id: Date.now(), message, type };
    setToasts((prev) => [...prev, newToast]);

    // Automatically remove the toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== newToast.id));
    }, 3000);
  };

  return { toasts, showToast };
}
