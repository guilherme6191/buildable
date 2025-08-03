export const getEmptyAppTemplate = (appName: string) => `
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${appName}</title>
    <style>
      body { 
        font-family: system-ui, -apple-system, sans-serif; 
        margin: 0; 
        padding: 3rem 2rem; 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        color: white;
      }
      .container {
        text-align: center;
        max-width: 600px;
        background: rgba(255, 255, 255, 0.1);
        padding: 2rem;
        border-radius: 1rem;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      h1 { 
        font-size: 2.5rem;
        margin-bottom: 1rem; 
        background: linear-gradient(45deg, #fff, #e0e7ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      p { 
        font-size: 1.1rem; 
        opacity: 0.9; 
        line-height: 1.6; 
        margin-bottom: 2rem; 
      }
      .cta { 
        background: rgba(255, 255, 255, 0.2); 
        padding: 0.75rem 1.5rem; 
        border-radius: 0.5rem; 
        border: 1px solid rgba(255, 255, 255, 0.3); 
        color: white; 
        text-decoration: none; 
        font-weight: 500; 
        transition: all 0.3s ease;
        display: inline-block;
      }
      .cta:hover { 
        background: rgba(255, 255, 255, 0.3); 
        transform: translateY(-2px); 
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>${appName}</h1>
      <p>Your app is ready to be built! Start chatting with the AI to create your application.</p>
      <a href="#" class="cta">Get Started</a>
    </div>
  </body>
</html>`;

export const getDefaultPreviewTemplate = (appName: string) => ({
  html: `<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
    <div class="text-center max-w-2xl">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to ${appName}</h1>
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
});

export const createCompleteHTMLDocument = (
  title: string,
  html: string,
  css: string,
  js?: string
) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    ${css.trim() ? `<style>${css}</style>` : ""}
  </head>
  <body>
    ${html}
    ${js && js.trim() ? `<script>${js}</script>` : ""}
  </body>
</html>`;

export const createAppPreviewDocument = (
  title: string,
  html: string,
  css: string,
  js?: string
) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <style>${css}</style>
  </head>
  <body>
    ${html}
    ${js ? `<script>${js}</script>` : ""}
  </body>
</html>`;