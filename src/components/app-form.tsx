"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Sparkles, Edit, Trash2, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createAppAction,
  updateAppAction,
  deleteAppAction,
} from "@/app/actions";
import { logError } from "@/lib/error-handling";
import { App } from "@/lib/types";

interface AppFormProps {
  mode?: "create" | "edit";
  app?: App;
  trigger?: React.ReactNode;
}

export function AppForm({ mode = "create", app, trigger }: AppFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const isEditMode = mode === "edit" && app;

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      if (isEditMode) {
        await updateAppAction(app.id, formData);
        setOpen(false);
        router.refresh();
      } else {
        await createAppAction(formData);
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      // Don't show error for Next.js redirects - they're expected behavior
      if (!(error instanceof Error && error.message === "NEXT_REDIRECT")) {
        logError(
          isEditMode ? "updating app from form" : "creating app from form",
          error
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !app ||
      !confirm(
        "Are you sure you want to delete this app? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAppAction(app.id);
      setOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      // Don't show error alert for Next.js redirects - they're expected behavior
      if (!(error instanceof Error && error.message === "NEXT_REDIRECT")) {
        logError("deleting app from form", error);
        alert("Failed to delete app. Please try again.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const defaultTrigger = isEditMode ? (
    <Button variant="outline" size="sm" className="gap-2">
      <Edit className="w-4 h-4" />
      Edit
    </Button>
  ) : (
    <Button className="gap-2">
      <Plus className="w-4 h-4" />
      Create New App
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            {isEditMode ? "Edit App" : "Create New App"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update your app's name and description."
              : "Give your new app a name and description to get started building with AI."}
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">App Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="My Awesome App"
              defaultValue={isEditMode ? app.name : ""}
              required
              disabled={isLoading || isDeleting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              name="description"
              placeholder="A brief description of your app"
              defaultValue={isEditMode ? app.description || "" : ""}
              disabled={isLoading || isDeleting}
            />
          </div>
          <DialogFooter className={isEditMode ? "justify-between" : ""}>
            {isEditMode && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading || isDeleting}
                className="gap-2"
              >
                {isDeleting ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            )}
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant="outline" disabled={isLoading || isDeleting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading || isDeleting}>
                {isLoading
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                    ? "Update App"
                    : "Create App"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Backward compatibility - keep the original CreateAppForm export
export function CreateAppForm() {
  return <AppForm mode="create" />;
}
