"use client";

import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface FilterButtonProps {
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
}

export function FilterButton({ 
  onClick, 
  isActive = false, 
  disabled = false 
}: FilterButtonProps) {
  return (
    <Button 
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={onClick || (() => {})}
      disabled={disabled}
    >
      <Filter className="h-4 w-4 mr-2" />
      フィルター
    </Button>
  );
}
