import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">App Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            The app you&apos;re looking for doesn&apos;t exist or may have been
            deleted.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-500">
              This could happen if:
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-500 list-disc list-inside space-y-1">
              <li>The app slug is invalid</li>
              <li>The app was deleted</li>
              <li>You don&apos;t have access to this app</li>
            </ul>
          </div>
          <div className="flex gap-2 justify-center">
            <Button asChild variant="outline">
              <Link href="/">← Back to Apps</Link>
            </Button>
            <Button asChild>
              <Link href="/">Create New App</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
