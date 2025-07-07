"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  SortAsc 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SearchAndFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  placeholder?: string;
  showSort?: boolean;
  sortOptions?: { value: string; label: string }[];
  onSortChange?: (value: string) => void;
  showFilter?: boolean;
  onFilterClick?: () => void;
}

export function SearchAndFilterBar({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  placeholder = "検索...",
  showSort = false,
  sortOptions = [],
  onSortChange,
  showFilter = true,
  onFilterClick
}: SearchAndFilterBarProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4 flex-1">
        {/* 検索バー */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* ソートドロップダウン */}
        {showSort && sortOptions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <SortAsc className="h-4 w-4 mr-2" />
                並び順
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {sortOptions.map((option) => (
                <DropdownMenuItem 
                  key={option.value}
                  onClick={() => onSortChange?.(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* フィルターボタン */}
        {showFilter && (
          <Button variant="outline" size="sm" onClick={onFilterClick}>
            <Filter className="h-4 w-4 mr-2" />
            フィルター
          </Button>
        )}
      </div>

      {/* 表示切り替えボタン */}
      <div className="flex items-center border rounded-lg p-1">
        <Button
          variant={viewMode === "grid" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("grid")}
          className="p-1"
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("list")}
          className="p-1"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
