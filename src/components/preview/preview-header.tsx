"use client";

import { Button } from "@/components/ui/button";
import {
  Eye,
  RefreshCw,
  FileText,
  Palette,
  Zap,
  Copy,
  Check,
} from "lucide-react";

export type ViewMode = "preview" | "html" | "css" | "js";

interface PreviewHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onRefresh: () => void;
  onCopy: () => void;
  isRefreshing: boolean;
  copySuccess: boolean;
  appName: string;
}

const getViewModeIcon = (mode: ViewMode) => {
  switch (mode) {
    case "html":
      return <FileText className="w-full h-full" />;
    case "css":
      return <Palette className="w-full h-full" />;
    case "js":
      return <Zap className="w-full h-full" />;
    default:
      return <Eye className="w-full h-full" />;
  }
};

export function PreviewHeader({
  viewMode,
  onViewModeChange,
  onRefresh,
  onCopy,
  isRefreshing,
  copySuccess,
}: PreviewHeaderProps) {
  return (
    <div className="p-3 md:p-4 lg:p-6 border-b border-border/50 bg-card">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
          <div className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-white">
              {getViewModeIcon(viewMode)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm md:text-base lg:text-lg font-semibold truncate">
              {viewMode === "preview" ? "Live Preview" : viewMode.toUpperCase()}
            </h2>
            <p className="text-xs text-muted-foreground truncate hidden sm:block">
              {viewMode === "preview"
                ? "See your changes in real-time"
                : `View ${viewMode.toUpperCase()} source code (read-only)`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          <div className="flex items-center gap-1 md:gap-2">
            <div className="flex bg-muted/50 p-0.5 md:p-1 rounded-md md:rounded-lg">
              {(["preview", "html", "css", "js"] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={viewMode === mode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewModeChange(mode)}
                  className="h-7 md:h-8 px-1.5 md:px-2 lg:px-3 text-xs lg:text-sm gap-0.5 md:gap-1 lg:gap-2 min-w-0"
                >
                  <span className="flex-shrink-0">{getViewModeIcon(mode)}</span>
                  <span className="capitalize hidden [@media(min-width:400px)]:inline lg:inline">
                    {mode}
                  </span>
                </Button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={viewMode === "preview" ? onRefresh : onCopy}
              disabled={viewMode === "preview" ? isRefreshing : copySuccess}
              className="h-7 md:h-8 px-2 md:px-3 gap-1 w-24"
            >
              {viewMode === "preview" ? (
                <>
                  <RefreshCw
                    className={`w-3 h-3 md:w-4 md:h-4 ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  />
                  <span className="hidden lg:inline text-xs md:text-sm">
                    Refresh
                  </span>
                </>
              ) : (
                <>
                  {copySuccess ? (
                    <Check className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                  ) : (
                    <Copy className="w-3 h-3 md:w-4 md:h-4" />
                  )}
                  <span className="hidden lg:inline text-xs md:text-sm">
                    {copySuccess ? "Copied!" : "Copy"}
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
