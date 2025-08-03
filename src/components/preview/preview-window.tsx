"use client";

import { useState } from "react";
import { App } from "@/lib/types";
import {
  PreviewHeader,  
  PreviewContent,
  CodeContent,
  type ViewMode,
} from ".";
import { getEmptyAppTemplate, createAppPreviewDocument } from "@/lib/templates";
import { TIMING } from "@/lib/constants";
import { logError } from "@/lib/error-handling";

interface PreviewWindowProps {
  app: App;
}

export function PreviewWindow({ app }: PreviewWindowProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const getPreviewContent = () => {
    if (!app.preview) {
      return getEmptyAppTemplate(app.name);
    }

    return createAppPreviewDocument(
      app.name,
      app.preview.html,
      app.preview.css,
      app.preview.js
    );
  };

  const getFileContent = (mode: ViewMode): string => {
    switch (mode) {
      case "html":
        return app.preview?.html || "<!-- No HTML content yet -->";
      case "css":
        return app.preview?.css || "/* No CSS content yet */";
      case "js":
        return app.preview?.js || "// No JavaScript content yet";
      default:
        return "";
    }
  };

  const copyToClipboard = async () => {
    if (viewMode === "preview") {
      return;
    }

    const content = getFileContent(viewMode);
    if (
      !content ||
      (content.includes("No ") && content.includes("content yet"))
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), TIMING.COPY_SUCCESS_DURATION);
    } catch (err) {
      logError("clipboard copy", err);

      const textArea = document.createElement("textarea");
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), TIMING.COPY_SUCCESS_DURATION);
      } catch (fallbackErr) {
        logError("fallback clipboard copy", fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), TIMING.REFRESH_DELAY);
  };

  const renderContent = () => {
    if (viewMode === "preview") {
      return <PreviewContent content={getPreviewContent()} />;
    }

    return (
      <CodeContent content={getFileContent(viewMode)} language={viewMode} />
    );
  };

  return (
    <div className="h-full flex flex-col">
      <PreviewHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRefresh={handleRefresh}
        onCopy={copyToClipboard}
        isRefreshing={isRefreshing}
        copySuccess={copySuccess}
        appName={app.name}
      />

      <div className="flex-1 bg-gradient-to-br from-muted/20 via-background to-muted/10">
        {renderContent()}
      </div>
    </div>
  );
}
