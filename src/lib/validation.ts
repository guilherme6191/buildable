import { createError } from "./error-handling";

export function validateMessage(message: string, appId: string): void {
  if (!message?.trim()) {
    throw createError("Message is required");
  }
  
  if (!appId?.trim()) {
    throw createError("App ID is required");
  }
}

export function validateAppName(name: string): void {
  if (!name?.trim()) {
    throw createError("App name is required");
  }
}