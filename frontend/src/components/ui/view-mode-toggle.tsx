"use client";

import { Button } from "@/components/ui/button";
import { Grid3X3, List } from "lucide-react";

interface ViewModeToggleProps {
  value: "grid" | "list";
  onChange: (value: "grid" | "list") => void;
}

export function ViewModeToggle({ value, onChange }: ViewModeToggleProps) {
  return (
    <div className="flex items-center border rounded-lg p-1">
      <Button
        variant={value === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => onChange("grid")}
        className="p-1"
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
      <Button
        variant={value === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => onChange("list")}
        className="p-1"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}
