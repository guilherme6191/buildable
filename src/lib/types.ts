export interface App {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  preview?: {
    html: string;
    css: string;
    js?: string;
  };
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  appId: string;
}

export interface Conversation {
  appId: string;
  messages: Message[];
}

export interface CreateAppData {
  name: string;
  slug?: string;
  description?: string;
}

export interface UpdateAppData {
  name?: string;
  description?: string;
  preview?: {
    html: string;
    css: string;
    js?: string;
  };
}
