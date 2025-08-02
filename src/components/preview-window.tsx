"use client";

import { useState } from "react";
import { Monitor, Tablet, Smartphone, Eye, RefreshCw } from "lucide-react";
import { App } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface PreviewWindowProps {
  app: App;
}

export function PreviewWindow({ app }: PreviewWindowProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );
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
                line-height: 1.6; 
                opacity: 0.9;
                margin-bottom: 1.5rem;
              }
              .cta {
                display: inline-block;
                padding: 0.75rem 1.5rem;
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 0.5rem;
                color: white;
                text-decoration: none;
                font-weight: 500;
                transition: all 0.3s ease;
              }
              .cta:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-2px);
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Welcome to ${app.name}</h1>
              <p>Your app is ready to be built! Start chatting with the AI assistant to bring your vision to life. Describe what you want to create and watch the magic happen.</p>
              <a href="#" class="cta">Start Building →</a>
            </div>
          </body>
        </html>
      `;
    }

    return `
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${app.name}</title>
          <style>
            ${app.preview.css || ""}
          </style>
        </head>
        <body>
          ${app.preview.html}
          ${app.preview.js ? `<script>${app.preview.js}</script>` : ""}
        </body>
      </html>
    `;
  };

  const getFrameWidth = () => {
    switch (viewMode) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      default:
        return "100%";
    }
  };

  const getViewModeIcon = (mode: "desktop" | "tablet" | "mobile") => {
    switch (mode) {
      case "mobile":
        return <Smartphone className="w-4 h-4" />;
      case "tablet":
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Modern Preview Header */}
      <div className="p-6 border-b border-border/50 bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Live Preview</h2>
              <p className="text-sm text-muted-foreground">
                See your changes in real-time
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
            <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
              {(["desktop", "tablet", "mobile"] as const).map((mode) => (
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

      {/* Modern Preview Content */}
      <div className="flex-1 p-6 bg-gradient-to-br from-muted/20 via-background to-muted/10">
        <div className="h-full flex items-center justify-center">
          <div
            className={`bg-card rounded-xl shadow-2xl overflow-hidden transition-all duration-500 border border-border/50 ${
              viewMode === "mobile"
                ? "shadow-xl"
                : viewMode === "tablet"
                  ? "shadow-lg"
                  : "shadow-2xl"
            }`}
            style={{
              width: getFrameWidth(),
              height:
                viewMode === "mobile"
                  ? "667px"
                  : viewMode === "tablet"
                    ? "80%"
                    : "100%",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          >
            {/* Browser-like header for desktop */}
            {viewMode === "desktop" && (
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
            )}
            <iframe
              key={isRefreshing ? Date.now() : "static"}
              srcDoc={getPreviewContent()}
              className="w-full border-0"
              style={{
                height: viewMode === "desktop" ? "calc(100% - 40px)" : "100%",
              }}
              title={`${app.name} Preview`}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
