import Link from "next/link";
import { Plus, Sparkles, ArrowRight, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { getApps } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { CreateAppForm } from "@/components/create-app-form";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function HomePage() {
  const apps = await getApps();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold">Buildable</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            buildable
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Transform your ideas into vanilla web MVPs. Chat with
            AI to create, modify, and iterate on your web apps in real-time.
          </p>
        </div>

        {apps.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl p-12 border">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">
                Ready to start building?
              </h3>
              <p className="text-muted-foreground mb-8 text-lg">
                Create your first app and experience the power of AI-assisted
                development. Build anything from simple websites to complex
                applications.
              </p>
              <CreateAppForm />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold">Your Apps</h2>
                <p className="text-muted-foreground">
                  {apps.length} {apps.length === 1 ? "app" : "apps"} ready to
                  build
                </p>
              </div>
              <CreateAppForm />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apps.map((app) => (
                <Link key={app.id} href={`/apps/${app.slug}`}>
                  <Card
                    key={app.id}
                    className="group cursor-pointer border-border/50"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-3">
                          <Code className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(app.updatedAt)}
                        </div>
                      </div>
                      <CardTitle>{app.name}</CardTitle>
                      {app.description && (
                        <CardDescription className="line-clamp-2 leading-relaxed">
                          {app.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button asChild variant="ghost" className="w-full ">
                        <span>
                          Open App
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
