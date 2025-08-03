import Anthropic from "@anthropic-ai/sdk";
import { Message } from "./types";
import { getSystemPrompt } from "./prompt";
import { extractField } from "./utils";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface GenerateCodeResponse {
  html?: string;
  css?: string;
  js?: string;
  explanation: string;
}

export async function generateAppCode(
  userMessage: string,
  conversationHistory: Message[],
  currentHtml?: string,
  currentCss?: string,
  currentJs?: string,
  appName?: string,
): Promise<GenerateCodeResponse> {
  const systemPrompt = getSystemPrompt(
    appName || "User App",
    currentHtml || "",
    currentCss || "",
    currentJs || "",
  );

  const messages: Anthropic.Messages.MessageParam[] = [];
  const historyMessages = conversationHistory.slice(0, -1);

  for (const msg of historyMessages) {
    messages.push({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    });
  }

  messages.push({
    role: "user",
    content: userMessage,
  });

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      temperature: 0.7,
      system: systemPrompt,
      messages,
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Anthropic");
    }

    let jsonStr = content.text.trim();
    if (jsonStr.startsWith("```")) {
      const codeBlockMatch = jsonStr.match(
        /```(?:json)?\s*(\{[\s\S]*?\})\s*```/,
      );
      if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1];
      }
    }

    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        explanation: content.text,
      };
    }

    try {
      const result = JSON.parse(jsonMatch[0]) as GenerateCodeResponse;
      return result;
    } catch (parseError) {
      console.error("JSON parsing failed:", parseError);
      console.error(
        "Attempted to parse:",
        jsonMatch[0].substring(0, 200) + "...",
      );

      const html = extractField(content.text, "html");
      const css = extractField(content.text, "css");
      const js = extractField(content.text, "js");
      const explanation =
        extractField(content.text, "explanation") ||
        "I generated code for you, but there was an issue with the response format.";

      return {
        html,
        css,
        js,
        explanation,
      };
    }
  } catch (error) {
    console.error("Error calling Anthropic API:", error);
    return {
      explanation:
        "Sorry, I encountered an error processing your request. Please try again.",
    };
  }
}
