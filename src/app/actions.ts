"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createApp, updateApp, deleteApp, addMessage } from "@/lib/data";
import { CreateAppData, UpdateAppData } from "@/lib/types";
import { generateAppCode } from "@/lib/anthropic";

export async function createAppAction(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!name?.trim()) {
      console.error("Attempted to create app without name");
      throw new Error("App name is required");
    }

    const appData: CreateAppData = {
      name: name.trim(),
      description: description?.trim() || undefined,
    };

    const app = await createApp(appData);

    revalidatePath("/");
    redirect(`/apps/${app.slug}`);
  } catch (error) {
    console.error("Error creating app:", error);
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
    if (!message?.trim()) {
      console.error("Empty message sent to sendMessageAction:", { appId });
      throw new Error("Message is required");
    }

  

    await addMessage(appId, "user", message.trim());

    const { getApp } = await import("@/lib/data");
    const app = await getApp(appId);

    if (!app) {
      console.error("App not found for message:", { appId });
      throw new Error("App not found");
    }

    try {
      const { getConversation } = await import("@/lib/data");
      const conversation = await getConversation(appId);

      const result = await generateAppCode(
        message.trim(),
        conversation.messages || [],
        app.preview?.html,
        app.preview?.css,
        app.preview?.js,
        app.name
      );

      await addMessage(appId, "assistant", result.explanation);

      if (result.html || result.css || result.js) {
        await updateAppPreviewAction(
          appId,
          result.html || app.preview?.html || "",
          result.css || app.preview?.css || "",
          result.js || app.preview?.js
        );
      }
    } catch (error) {
      console.error("Error processing AI request:", { appId, error });

      try {
        await addMessage(
          appId,
          "assistant",
          "Sorry, I encountered an error processing your request. Please try again."
        );
      } catch (messageError) {
        console.error("Failed to add error message:", { appId, messageError });
      }
    }

    revalidatePath(`/apps/${appId}`);
  } catch (error) {
    console.error("Critical error in sendMessageAction:", { appId, error });
    throw error;
  }
}
