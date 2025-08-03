import { FILE_TYPES } from "./constants";

export interface FileDownload {
  content: string;
  filename: string;
  type: string;
}

export function createFileBlob(content: string, type: string): Blob {
  return new Blob([content], { type });
}

export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadFiles(files: FileDownload[]): number {
  let downloadCount = 0;
  
  files.forEach(({ content, filename, type }) => {
    if (content.trim()) {
      const blob = createFileBlob(content, type);
      downloadFile(blob, filename);
      downloadCount++;
    }
  });
  
  return downloadCount;
}

export function sanitizeFilename(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "-");
}

export function getProjectFiles(
  app: { name: string; slug?: string; preview?: { html?: string; css?: string; js?: string } }
): FileDownload[] {
  if (!app.preview) return [];
  
  const { html = "", css = "", js = "" } = app.preview;
  const baseFilename = app.slug || sanitizeFilename(app.name);
  
  return [
    { content: html, filename: `${baseFilename}.html`, type: FILE_TYPES.HTML },
    { content: css, filename: `${baseFilename}.css`, type: FILE_TYPES.CSS },
    { content: js, filename: `${baseFilename}.js`, type: FILE_TYPES.JAVASCRIPT },
  ].filter(file => file.content.trim());
}