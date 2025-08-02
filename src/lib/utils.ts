import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Helper function to extract fields from malformed JSON responses
export function extractField(
  text: string,
  fieldName: string,
): string | undefined {
  // Try standard JSON field first
  const jsonPattern = new RegExp(
    '"' + fieldName + '"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"',
  );
  const jsonMatch = text.match(jsonPattern);
  if (jsonMatch && jsonMatch[1]) {
    return jsonMatch[1];
  }

  // Try to find field with backticks
  const backtickStart = text.indexOf('"' + fieldName + '":');
  if (backtickStart !== -1) {
    const afterColon = text.substring(backtickStart + fieldName.length + 3);
    const backtickMatch = afterColon.match(/`([^`]*)`/);
    if (backtickMatch && backtickMatch[1]) {
      return backtickMatch[1];
    }
  }

  return undefined;
}

// Generate URL-friendly slug from text
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// Ensure slug is unique by adding suffix if needed
export function ensureUniqueSlug(
  baseSlug: string,
  existingSlugs: string[],
): string {
  let slug = baseSlug;
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

// Generate short ID for uniqueness
export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 8);
}
