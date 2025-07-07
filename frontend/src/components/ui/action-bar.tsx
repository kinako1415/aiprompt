"use client";

import { ReactNode } from "react";

interface ActionBarProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function ActionBar({ title, children, className = "" }: ActionBarProps) {
  return (
    <div
      className={`flex items-center justify-between p-4 bg-white border-b border-gray-100 ${className}`}
    >
      {title && (
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      )}
      <div className="flex items-center space-x-2">{children}</div>
    </div>
  );
}
