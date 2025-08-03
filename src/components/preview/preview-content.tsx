import { SANDBOX_PERMISSIONS } from "@/lib/constants";

interface PreviewContentProps {
  content: string;
}

export function PreviewContent({ content }: PreviewContentProps) {
  return (
    <div className="h-full p-3 md:p-6">
      <div className="h-full bg-card rounded-lg md:rounded-xl shadow-lg md:shadow-2xl overflow-hidden border border-border/50">
        <div className="h-8 md:h-10 bg-muted/50 border-b border-border/50 flex items-center px-3 md:px-4 gap-2">
          <div className="flex gap-1.5 md:gap-2">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-red-400 rounded-full"></div>
            <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-2 h-2 md:w-3 md:h-3 bg-green-400 rounded-full"></div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-background/50 px-2 md:px-3 py-0.5 md:py-1 rounded text-xs text-muted-foreground truncate">
              Preview
            </div>
          </div>
        </div>
        <iframe
          srcDoc={content}
          className="w-full border-0"
          style={{ height: "calc(100% - 32px)" }}
          sandbox={SANDBOX_PERMISSIONS}
          title="App Preview"
        />
      </div>
    </div>
  );
}
