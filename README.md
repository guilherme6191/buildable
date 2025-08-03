# buildable - AI-Powered vanilla web app builder

A high-level Lovable clone that lets you build vanilla web applications through AI chat interactions.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file:

```bash
# Anthropic API (required for AI chat)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Supabase (required for data persistence)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL migration to create tables and seed data:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and run the contents of `supabase/migrations/001_initial_schema.sql`

### 4. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start building apps with AI.

## How it Works

- Create apps from the dashboard
- Chat with AI to build and modify your applications
- Preview changes in real-time
- All conversations and app data are saved automatically
