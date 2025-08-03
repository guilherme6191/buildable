"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, MessageCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Conversation } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { sendMessageAction } from "@/app/actions";

interface ChatInterfaceProps {
  appId: string;
  conversation: Conversation;
}

export function ChatInterface({ appId, conversation }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    const currentMessage = message;
    setMessage("");

    try {
      await sendMessageAction(appId, currentMessage);
    } catch (error) {
      console.error("Failed to send message:", {
        appId,
        message: currentMessage,
        error,
      });

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Failed to send message: ${errorMessage}\n\n`);

      setMessage(currentMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 md:p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-semibold">AI Assistant</h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              Chat to build and modify your app
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversation.messages.length === 0 ? (
          <div className="h-full flex items-center justify-center p-6">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3">
                Start Building with AI
              </h3>
              <p className="text-muted-foreground mb-6">
                Describe what you want to build and I&apos;ll help you create it
                step by step.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg text-left">
                  <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Try asking:</p>
                    <ul className="text-muted-foreground space-y-1 mt-1">
                      <li>• &quot;Add a navigation bar with logo&quot;</li>
                      <li>• &quot;Create a hero section&quot;</li>
                      <li>• &quot;Make it look more modern&quot;</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {conversation.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } group`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                      : "bg-muted border border-border/50"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p
                    className={`text-xs mt-2 opacity-70 ${
                      msg.role === "user"
                        ? "text-blue-100"
                        : "text-muted-foreground"
                    }`}
                  >
                    {formatDate(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted border border-border/50 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      AI is building your request...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="p-3 md:p-4 border-t border-border/50 bg-card">
        <form onSubmit={handleSubmit} className="flex gap-2 md:gap-3 items-center">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe what you want to build or change..."
            disabled={isLoading}
            className="text-sm md:text-base"
          />
          <Button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="gap-1 md:gap-2 min-w-[60px] md:min-w-[80px] text-sm md:text-base"
            size="sm"
          >
            {isLoading ? (
              <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Send</span>
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
