"use client";

import { useState } from "react";
import { Eye, RefreshCw, FileText, Palette, Zap } from "lucide-react";
import { App } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface PreviewWindowProps {
  app: App;
}

type ViewMode = "preview" | "html" | "css" | "js";

export function PreviewWindow({ app }: PreviewWindowProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const getViewModeIcon = (mode: ViewMode) => {
    switch (mode) {
      case "html":
        return <FileText className="w-4 h-4" />;
      case "css":
        return <Palette className="w-4 h-4" />;
      case "js":
        return <Zap className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
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

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-border/50 bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              {getViewModeIcon(viewMode)}
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                {viewMode === "preview"
                  ? "Live Preview"
                  : viewMode.toUpperCase()}
              </h2>
              <p className="text-sm text-muted-foreground">
                {viewMode === "preview"
                  ? "See your changes in real-time"
                  : `View ${viewMode.toUpperCase()} source code (read-only)`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {viewMode === "preview" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            )}
            <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
              {(["preview", "html", "css", "js"] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={viewMode === mode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode(mode)}
                  className="gap-2 min-w-[70px]"
                >
                  {getViewModeIcon(mode)}
                  <span className="capitalize hidden sm:inline">{mode}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-gradient-to-br from-muted/20 via-background to-muted/10">
        {viewMode === "preview" ? (
          <div className="h-full p-6">
            <div className="h-full bg-card rounded-xl shadow-2xl overflow-hidden border border-border/50">
              <div className="h-10 bg-muted/50 border-b border-border/50 flex items-center px-4 gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-background/50 px-3 py-1 rounded text-xs text-muted-foreground">
                    {app.name}
                  </div>
                </div>
              </div>
              <iframe
                key={isRefreshing ? Date.now() : "static"}
                srcDoc={getPreviewContent()}
                className="w-full border-0"
                style={{ height: "calc(100% - 40px)" }}
                title={`${app.name} Preview`}
                sandbox="allow-scripts allow-forms"
              />
            </div>
          </div>
        ) : (
          <div className="h-full p-6">
            <div className="h-full bg-card rounded-xl shadow-lg overflow-hidden border border-border/50">
              <div className="h-10 bg-muted/50 border-b border-border/50 flex items-center px-4">
                <div className="flex items-center gap-2">
                  {getViewModeIcon(viewMode)}
                  <span className="text-sm font-medium text-muted-foreground">
                    {viewMode}.{viewMode === "js" ? "js" : viewMode} (read-only)
                  </span>
                </div>
              </div>
              <pre
                className="overflow-auto p-4 text-sm font-mono leading-relaxed text-foreground bg-background/50"
                style={{ height: "calc(100% - 40px)" }}
              >
                <code>{getFileContent(viewMode)}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
