import React from "react";
import { cn } from "@/utils/cn"; // Utility for className merging (if using ShadCN setup)

const Menu = ({ children }) => {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-md shadow-md">
      {children}
    </div>
  );
};

const MenuLabel = ({ children }) => (
  <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
    {children}
  </div>
);

const MenuItem = ({ children, onClick, className }) => (
  <div
    onClick={onClick}
    className={cn(
      "px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md cursor-pointer",
      className
    )}
  >
    {children}
  </div>
);

Menu.Label = MenuLabel;
Menu.Item = MenuItem;

export { Menu };
