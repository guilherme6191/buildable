-- Create apps table
CREATE TABLE IF NOT EXISTS apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  html TEXT DEFAULT '',
  css TEXT DEFAULT '',
  js TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_app_id_created ON messages(app_id, created_at);
CREATE INDEX IF NOT EXISTS idx_apps_created_at ON apps(created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_apps_slug ON apps(slug);

-- Create updated_at trigger for apps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_apps_updated_at 
  BEFORE UPDATE ON apps 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO apps (id, name, slug, description, html, css, created_at, updated_at) VALUES 
(
  '00000000-0000-0000-0000-000000000001',
  'Todo App',
  'todo-app',
  'A simple todo application',
  '<div class="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg">
    <h1 class="text-2xl font-bold mb-4">My Todo App</h1>
    <div class="space-y-2">
      <div class="flex items-center space-x-2">
        <input type="checkbox" class="rounded">
        <span>Learn React</span>
      </div>
      <div class="flex items-center space-x-2">
        <input type="checkbox" class="rounded" checked>
        <span class="line-through text-gray-500">Setup project</span>
      </div>
    </div>
  </div>',
  'body { font-family: system-ui, -apple-system, sans-serif; background: #f3f4f6; padding: 2rem; }',
  '2024-01-01 10:00:00+00',
  '2024-01-01 10:00:00+00'
),
(
  '00000000-0000-0000-0000-000000000002',
  'Landing Page',
  'landing-page',
  'A product landing page',
  '<div class="text-center p-8">
    <h1 class="text-4xl font-bold mb-4">Welcome to Our Product</h1>
    <p class="text-lg text-gray-600 mb-8">The best solution for your needs</p>
    <button class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">Get Started</button>
  </div>',
  'body { font-family: system-ui, -apple-system, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }',
  '2024-01-02 10:00:00+00',
  '2024-01-02 10:00:00+00'
);

-- Insert sample messages
INSERT INTO messages (app_id, role, content, created_at) VALUES 
(
  '00000000-0000-0000-0000-000000000001',
  'user',
  'Create a simple todo app with checkboxes',
  '2024-01-01 10:00:00+00'
),
(
  '00000000-0000-0000-0000-000000000001',
  'assistant',
  'I''ll create a simple todo app for you with checkboxes. Here''s a clean design with a couple of sample tasks.',
  '2024-01-01 10:01:00+00'
);