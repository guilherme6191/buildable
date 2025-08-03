import { supabase } from "./supabase";
import {
  App,
  Message,
  Conversation,
  CreateAppData,
  UpdateAppData,
} from "./types";

export async function getApps(): Promise<App[]> {
  const { data, error } = await supabase
    .from("apps")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching apps:", error);
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
      // Handle different types of errors
      if (error.code === "PGRST116") {
        console.log(`App not found with ID: ${id}`);
        return null; // Not found
      }

      if (error.code === "22P02") {
        console.log(`Invalid UUID format for app ID: ${id}`);
        return null; // Invalid UUID format
      }

      // Log other database errors but don't crash
      console.error("Database error fetching app:", {
        id,
        error: error.message,
        code: error.code,
        details: error.details,
      });
      return null;
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
    console.error("Unexpected error fetching app:", { id, error: err });
    return null;
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
      // Handle different types of errors
      if (error.code === "PGRST116") {
        console.log(`App not found with slug: ${slug}`);
        return null; // Not found
      }

      // Log other database errors but don't crash
      console.error("Database error fetching app by slug:", {
        slug,
        error: error.message,
        code: error.code,
        details: error.details,
      });
      return null;
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
    console.error("Unexpected error fetching app by slug:", {
      slug,
      error: err,
    });
    return null;
  }
}

export async function createApp(appData: CreateAppData): Promise<App> {
  // Generate slug from name if not provided
  const { generateSlug, ensureUniqueSlug } = await import("./utils");
  let slug = appData.slug || generateSlug(appData.name);

  // Ensure slug is unique
  const { data: existingApps } = await supabase.from("apps").select("slug");

  if (existingApps) {
    const existingSlugs = existingApps.map((app) => app.slug);
    slug = ensureUniqueSlug(slug, existingSlugs);
  }

  const defaultPreview = {
    html: `<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div class="text-center max-w-2xl">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to ${appData.name}</h1>
        <p class="text-lg text-gray-600 mb-8">Start building your app by chatting with the AI assistant. Try asking to:</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h3 class="font-semibold text-gray-900 mb-2">🎨 Design</h3>
            <p class="text-sm text-gray-600">"Add a navigation bar" or "Make it more colorful"</p>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h3 class="font-semibold text-gray-900 mb-2">🔧 Features</h3>
            <p class="text-sm text-gray-600">"Create a contact form" or "Add a gallery"</p>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h3 class="font-semibold text-gray-900 mb-2">📱 Layout</h3>
            <p class="text-sm text-gray-600">"Make it responsive" or "Center the content"</p>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h3 class="font-semibold text-gray-900 mb-2">✨ Polish</h3>
            <p class="text-sm text-gray-600">"Add animations" or "Improve the typography"</p>
          </div>
        </div>
      </div>
    </div>`,
    css: "body { font-family: system-ui, -apple-system, sans-serif; margin: 0; }",
    js: "",
  };

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
    console.error("Error creating app:", error);
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
  updateData: UpdateAppData,
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
      return null; // Not found
    }
    console.error("Error updating app:", error);
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
  const { error } = await supabase.from("apps").delete().eq("id", id);

  if (error) {
    console.error("Error deleting app:", error);
    throw new Error("Failed to delete app");
  }

  return true;
}

export async function getConversation(appId: string): Promise<Conversation> {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("app_id", appId)
      .order("created_at", { ascending: true });

    if (error) {
      // Log the error but return empty conversation rather than crashing
      console.error("Database error fetching conversation:", {
        appId,
        error: error.message,
        code: error.code,
        details: error.details,
      });

      // Return empty conversation for invalid UUIDs or other errors
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
    console.error("Unexpected error fetching conversation:", {
      appId,
      error: err,
    });
    return { appId, messages: [] };
  }
}

export async function addMessage(
  appId: string,
  role: "user" | "assistant",
  content: string,
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
      console.error("Database error adding message:", {
        appId,
        role,
        error: error.message,
        code: error.code,
        details: error.details,
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
    console.error("Unexpected error adding message:", {
      appId,
      role,
      error: err,
    });
    throw err;
  }
}
