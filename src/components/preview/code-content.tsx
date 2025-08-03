interface CodeContentProps {
  content: string;
  language: string;
}

export function CodeContent({ content, language }: CodeContentProps) {
  return (
    <div className="h-full p-3 md:p-6">
      <div className="h-full bg-card rounded-lg md:rounded-xl shadow-lg overflow-hidden border border-border/50">
        <div className="h-8 md:h-10 bg-muted/50 border-b border-border/50 flex items-center px-3 md:px-4">
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm font-medium text-muted-foreground">
              {language}-file.{language === "js" ? "js" : language}{" "}
              (read-only)
            </span>
          </div>
        </div>
        <pre
          className="overflow-auto p-3 md:p-4 text-xs md:text-sm font-mono leading-relaxed text-foreground bg-background/50"
          style={{ height: "calc(100% - 32px)" }}
        >
          <code className={`language-${language}`}>{content}</code>
        </pre>
      </div>
    </div>
  );
}