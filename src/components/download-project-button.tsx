"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { App } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DownloadProjectButtonProps {
  app: App;
  className?: string;
}

export function DownloadProjectButton({
  app,
  className,
}: DownloadProjectButtonProps) {
  const createCompleteHTML = () => {
    const { html = "", css = "", js = "" } = app.preview!;

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${app.name}</title>
    ${css.trim() ? `<style>${css}</style>` : ""}
  </head>
  <body>
    ${html}
    ${js && js.trim() ? `<script>${js}</script>` : ""}
  </body>
</html>`;
  };

  const downloadFiles = () => {
    if (!app.preview) {
      alert("No project files to download yet. Create some content first!");
      return;
    }

    const { html = "", css = "", js = "" } = app.preview;
    const fileName =
      app.slug || app.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    let downloadCount = 0;

    // Create and download complete HTML file (with embedded CSS and JS)
    if (html.trim() || css.trim() || (js && js.trim())) {
      const completeHTML = createCompleteHTML();
      const htmlBlob = new Blob([completeHTML], { type: "text/html" });
      const htmlUrl = URL.createObjectURL(htmlBlob);
      const htmlLink = document.createElement("a");
      htmlLink.href = htmlUrl;
      htmlLink.download = `${fileName}.html`;
      htmlLink.click();
      URL.revokeObjectURL(htmlUrl);
      downloadCount++;
    }

    // Create and download separate CSS file
    if (css.trim()) {
      const cssBlob = new Blob([css], { type: "text/css" });
      const cssUrl = URL.createObjectURL(cssBlob);
      const cssLink = document.createElement("a");
      cssLink.href = cssUrl;
      cssLink.download = `${fileName}.css`;
      cssLink.click();
      URL.revokeObjectURL(cssUrl);
      downloadCount++;
    }

    // Create and download separate JS file
    if (js && js.trim()) {
      const jsBlob = new Blob([js], { type: "text/javascript" });
      const jsUrl = URL.createObjectURL(jsBlob);
      const jsLink = document.createElement("a");
      jsLink.href = jsUrl;
      jsLink.download = `${fileName}.js`;
      jsLink.click();
      URL.revokeObjectURL(jsUrl);
      downloadCount++;
    }

    // Show feedback
    if (downloadCount > 0) {
      console.log(`Downloaded ${downloadCount} project file(s) successfully!`);
    } else {
      alert("No content found in project files to download.");
    }
  };

  return (
    <Button
      onClick={downloadFiles}
      variant="outline"
      size="sm"
      className={cn("gap-2", className)}
    >
      <Download className="w-4 h-4" />
      <span className="hidden sm:inline">Download</span>
    </Button>
  );
}
