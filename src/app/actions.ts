"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createApp,
  updateApp,
  deleteApp,
  addMessage,
  getApp,
  getConversation,
} from "@/lib/data";
import { CreateAppData, UpdateAppData } from "@/lib/types";
import { processAIRequest } from "@/lib/ai-service";
import { validateMessage, validateAppName } from "@/lib/validation";
import { logError } from "@/lib/error-handling";

export async function createAppAction(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    validateAppName(name);

    const appData: CreateAppData = {
      name: name.trim(),
      description: description?.trim() || undefined,
    };

    const app = await createApp(appData);

    revalidatePath("/");
    redirect(`/apps/${app.slug}`);
  } catch (error) {
    // Don't log redirect "errors" - they're expected behavior
    if (!(error instanceof Error && error.message === "NEXT_REDIRECT")) {
      logError("createAppAction", error);
    }
    throw error;
  }
}

export async function updateAppAction(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  const updateData: UpdateAppData = {};
  if (name?.trim()) updateData.name = name.trim();
  if (description !== undefined)
    updateData.description = description.trim() || undefined;

  await updateApp(id, updateData);
  revalidatePath("/");
  revalidatePath(`/apps/${id}`);
}

export async function deleteAppAction(id: string) {
  await deleteApp(id);
  revalidatePath("/");
  redirect("/");
}

export async function updateAppPreviewAction(
  id: string,
  html: string,
  css: string,
  js?: string
) {
  const updateData: UpdateAppData = {
    preview: { html, css, js },
  };

  await updateApp(id, updateData);
  revalidatePath(`/apps/${id}`);
}

export async function sendMessageAction(appId: string, message: string) {
  try {
    validateMessage(message, appId);

    await addMessage(appId, "user", message.trim());

    const app = await getApp(appId);
    if (!app) {
      logError("sendMessageAction", "App not found", { appId });
      throw new Error("App not found");
    }

    const conversation = await getConversation(appId);

    await processAIRequest({
      appId,
      userMessage: message,
      app,
      conversationMessages: conversation.messages || [],
    });

    revalidatePath(`/apps/${appId}`);
  } catch (error) {
    logError("sendMessageAction", error, { appId });
    throw error;
  }
}
