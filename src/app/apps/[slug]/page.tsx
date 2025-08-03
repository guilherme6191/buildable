import { notFound } from "next/navigation";
import { getAppBySlug, getConversation } from "@/lib/data";
import { ChatInterface } from "@/components/chat-interface";
import { PreviewWindow } from "@/components/preview-window";
import { DownloadProjectButton } from "@/components/download-project-button";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import Link from "next/link";
import { ArrowLeft, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { logError } from "@/lib/error-handling";

interface AppDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function AppDetailPage({ params }: AppDetailPageProps) {
  const { slug } = await params;

  try {
    const app = await getAppBySlug(slug);

    if (!app) {
      notFound();
    }

    const conversation = await getConversation(app.id);

    return (
      <div className="h-screen flex flex-col bg-background">
        <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button asChild variant="ghost" size="sm" className="gap-2">
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Link>
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Code className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold">{app.name}</h1>
                    {app.description && (
                      <p className="text-sm text-muted-foreground">
                        {app.description}
                      </p>
                    )}
                  </div>
                  <DownloadProjectButton app={app} className="ml-4" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col md:flex-row md:overflow-hidden">
          <div className="flex flex-col md:hidden h-full">
            <div className="flex-1 overflow-y-auto">
              <ChatInterface appId={app.id} conversation={conversation} />
            </div>
            <div className="flex-1 overflow-y-auto">
              <PreviewWindow app={app} />
            </div>
          </div>

          <ResizablePanelGroup
            direction="horizontal"
            className="hidden md:flex flex-1"
          >
            <ResizablePanel defaultSize={40} minSize={20} maxSize={70}>
              <ChatInterface appId={app.id} conversation={conversation} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={60} minSize={41}>
              <PreviewWindow app={app} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    );
  } catch (error) {
    logError("loading app detail page", error, { slug });
    notFound();
  }
}
