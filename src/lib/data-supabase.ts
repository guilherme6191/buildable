import { supabase } from "./supabase";
import {
  App,
  Message,
  Conversation,
  CreateAppData,
  UpdateAppData,
} from "./types";
import { getDefaultPreviewTemplate } from "./templates";
import {
  logError,
  handleDatabaseError,
  isNotFoundError,
  isInvalidUUIDError,
} from "./error-handling";

export async function getApps(): Promise<App[]> {
  const { data, error } = await supabase
    .from("apps")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    logError("fetching apps", error);
    throw new Error("Failed to fetch apps");
  }

  return data.map((dbApp) => ({
    id: dbApp.id,
    name: dbApp.name,
    slug: dbApp.slug,
    description: dbApp.description || undefined,
    createdAt: new Date(dbApp.created_at),
    updatedAt: new Date(dbApp.updated_at),
    preview: {
      html: dbApp.html,
      css: dbApp.css,
      js: dbApp.js || undefined,
    },
  }));
}

export async function getApp(id: string): Promise<App | null> {
  try {
    const { data, error } = await supabase
      .from("apps")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (isNotFoundError(error) || isInvalidUUIDError(error)) {
        return null;
      }
      return handleDatabaseError("fetching app", error, id);
    }

    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description || undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      preview: {
        html: data.html,
        css: data.css,
        js: data.js || undefined,
      },
    };
  } catch (err) {
    return handleDatabaseError("fetching app (unexpected)", err, id);
  }
}

export async function getAppBySlug(slug: string): Promise<App | null> {
  try {
    const { data, error } = await supabase
      .from("apps")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      if (isNotFoundError(error)) {
        return null;
      }
      return handleDatabaseError("fetching app by slug", error, slug);
    }

    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description || undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      preview: {
        html: data.html,
        css: data.css,
        js: data.js || undefined,
      },
    };
  } catch (err) {
    return handleDatabaseError("fetching app by slug (unexpected)", err, slug);
  }
}

export async function createApp(appData: CreateAppData): Promise<App> {
  const { generateSlug, ensureUniqueSlug } = await import("./utils");
  let slug = appData.slug || generateSlug(appData.name);

  const { data: existingApps } = await supabase.from("apps").select("slug");

  if (existingApps) {
    const existingSlugs = existingApps.map((app) => app.slug);
    slug = ensureUniqueSlug(slug, existingSlugs);
  }

  const defaultPreview = getDefaultPreviewTemplate(appData.name);

  const { data, error } = await supabase
    .from("apps")
    .insert({
      name: appData.name,
      slug: slug,
      description: appData.description || null,
      html: defaultPreview.html,
      css: defaultPreview.css,
      js: defaultPreview.js,
    })
    .select()
    .single();

  if (error) {
    logError("creating app", error, { name: appData.name });
    throw new Error("Failed to create app");
  }

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description || undefined,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    preview: {
      html: data.html,
      css: data.css,
      js: data.js || undefined,
    },
  };
}

export async function updateApp(
  id: string,
  updateData: UpdateAppData
): Promise<App | null> {
  const updates: Record<string, unknown> = {};

  if (updateData.name !== undefined) updates.name = updateData.name;
  if (updateData.description !== undefined)
    updates.description = updateData.description || null;
  if (updateData.preview?.html !== undefined)
    updates.html = updateData.preview.html;
  if (updateData.preview?.css !== undefined)
    updates.css = updateData.preview.css;
  if (updateData.preview?.js !== undefined)
    updates.js = updateData.preview.js || "";

  const { data, error } = await supabase
    .from("apps")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    logError("updating app", error, { id });
    throw new Error("Failed to update app");
  }

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description || undefined,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    preview: {
      html: data.html,
      css: data.css,
      js: data.js || undefined,
    },
  };
}

export async function deleteApp(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("apps").delete().eq("id", id);

    if (error) {
      logError("deleting app", error, { id });
      throw new Error("Failed to delete app");
    }

    return true;
  } catch (error) {
    logError("deleting app (unexpected)", error, { id });
    throw error;
  }
}

export async function getConversation(appId: string): Promise<Conversation> {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("app_id", appId)
      .order("created_at", { ascending: true });

    if (error) {
      logError("fetching conversation", error, { appId });
      return { appId, messages: [] };
    }

    const messages: Message[] = data.map((dbMessage) => ({
      id: dbMessage.id,
      role: dbMessage.role as "user" | "assistant",
      content: dbMessage.content,
      timestamp: new Date(dbMessage.created_at),
      appId: dbMessage.app_id,
    }));

    return { appId, messages };
  } catch (err) {
    logError("fetching conversation (unexpected)", err, { appId });
    return { appId, messages: [] };
  }
}

export async function addMessage(
  appId: string,
  role: "user" | "assistant",
  content: string
): Promise<Message> {
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        app_id: appId,
        role,
        content,
      })
      .select()
      .single();

    if (error) {
      logError("adding message", error, {
        appId,
        role,
        contentPreview: content.substring(0, 100) + "...",
      });
      throw new Error("Failed to add message");
    }

    return {
      id: data.id,
      role: data.role as "user" | "assistant",
      content: data.content,
      timestamp: new Date(data.created_at),
      appId: data.app_id,
    };
  } catch (err) {
    logError("adding message (unexpected)", err, {
      appId,
      role,
      contentPreview: content.substring(0, 100) + "...",
    });
    throw err;
  }
}
