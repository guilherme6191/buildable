export const TIMING = {
  COPY_SUCCESS_DURATION: 2000,
  REFRESH_DELAY: 500,
} as const;

export const AI = {
  MAX_TOKENS: 4000,
  TEMPERATURE: 0.7,
  MODEL: "claude-3-5-sonnet-20241022",
} as const;

export const FILE_TYPES = {
  HTML: "text/html",
  CSS: "text/css",
  JAVASCRIPT: "text/javascript",
} as const;

export const SANDBOX_PERMISSIONS = "allow-scripts allow-forms" as const;