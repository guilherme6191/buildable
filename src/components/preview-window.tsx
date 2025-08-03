"use client";

import { useState } from "react";
import { App } from "@/lib/types";
import {
  PreviewHeader,
  PreviewContent,
  CodeContent,
  type ViewMode,
} from "./preview";

interface PreviewWindowProps {
  app: App;
}

export function PreviewWindow({ app }: PreviewWindowProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const getPreviewContent = () => {
    if (!app.preview) {
      return `
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${app.name}</title>
            <style>
              body { 
                font-family: system-ui, -apple-system, sans-serif; 
                margin: 0; 
                padding: 3rem 2rem; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                color: white;
              }
              .container {
                text-align: center;
                max-width: 600px;
                background: rgba(255, 255, 255, 0.1);
                padding: 2rem;
                border-radius: 1rem;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
              }
              h1 { 
                font-size: 2.5rem;
                margin-bottom: 1rem; 
                background: linear-gradient(45deg, #fff, #e0e7ff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              }
              p { 
                font-size: 1.1rem; 
                opacity: 0.9; 
                line-height: 1.6; 
                margin-bottom: 2rem; 
              }
              .cta { 
                background: rgba(255, 255, 255, 0.2); 
                padding: 0.75rem 1.5rem; 
                border-radius: 0.5rem; 
                border: 1px solid rgba(255, 255, 255, 0.3); 
                color: white; 
                text-decoration: none; 
                font-weight: 500; 
                transition: all 0.3s ease;
                display: inline-block;
              }
              .cta:hover { 
                background: rgba(255, 255, 255, 0.3); 
                transform: translateY(-2px); 
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>${app.name}</h1>
              <p>Your app is ready to be built! Start chatting with the AI to create your application.</p>
              <a href="#" class="cta">Get Started</a>
            </div>
          </body>
        </html>
      `;
    }

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${app.name}</title>
          <style>${app.preview.css}</style>
        </head>
        <body>
          ${app.preview.html}
          ${app.preview.js ? `<script>${app.preview.js}</script>` : ""}
        </body>
      </html>
    `;
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
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);

      const textArea = document.createElement("textarea");
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackErr) {
        console.error("Fallback copy failed:", fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
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
