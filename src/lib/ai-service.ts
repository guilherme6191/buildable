import { App, Message } from "./types";
import { generateAppCode, GenerateCodeResponse } from "./anthropic";
import { addMessage } from "./data";
import { logError } from "./error-handling";

interface ProcessAIRequestParams {
  appId: string;
  userMessage: string;
  app: App;
  conversationMessages: Message[];
}

export async function processAIRequest({
  appId,
  userMessage,
  app,
  conversationMessages,
}: ProcessAIRequestParams): Promise<void> {
  try {
    const result = await generateAppCode(
      userMessage.trim(),
      conversationMessages,
      app.preview?.html,
      app.preview?.css,
      app.preview?.js,
      app.name,
    );

    await addMessage(appId, "assistant", result.explanation);

    if (result.html || result.css || result.js) {
      await updateAppPreview(appId, app, result);
    }
  } catch (error) {
    logError("AI request processing", error, { appId });
    
    try {
      await addMessage(
        appId,
        "assistant",
        "Sorry, I encountered an error processing your request. Please try again.",
      );
    } catch (messageError) {
      logError("adding error message", messageError, { appId });
    }
    
    throw error;
  }
}

async function updateAppPreview(
  appId: string,
  app: App,
  result: GenerateCodeResponse
): Promise<void> {
  const { updateApp } = await import("./data");
  
  await updateApp(appId, {
    preview: {
      html: result.html || app.preview?.html || "",
      css: result.css || app.preview?.css || "",
      js: result.js || app.preview?.js,
    },
  });
}