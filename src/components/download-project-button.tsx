"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { App } from "@/lib/types";
import { cn } from "@/lib/utils";
import { createCompleteHTMLDocument } from "@/lib/templates";
import { downloadFiles, getProjectFiles } from "@/lib/file-utils";

interface DownloadProjectButtonProps {
  app: App;
  className?: string;
}

export function DownloadProjectButton({
  app,
  className,
}: DownloadProjectButtonProps) {
  const handleDownload = () => {
    if (!app.preview) {
      alert("No project files to download yet. Create some content first!");
      return;
    }

    const files = getProjectFiles(app);
    
    if (files.length === 0) {
      alert("No content found in project files to download.");
      return;
    }

    // Add complete HTML file with embedded CSS and JS
    const { html = "", css = "", js = "" } = app.preview;
    if (html.trim() || css.trim() || js?.trim()) {
      const completeHTML = createCompleteHTMLDocument(app.name, html, css, js);
      const baseFilename = app.slug || app.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
      
      files.unshift({
        content: completeHTML,
        filename: `${baseFilename}.html`,
        type: "text/html"
      });
    }

    downloadFiles(files);
  };

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      size="sm"
      className={cn("gap-2", className)}
    >
      <Download className="w-4 h-4" />
      <span className="hidden sm:inline">Download</span>
    </Button>
  );
}
