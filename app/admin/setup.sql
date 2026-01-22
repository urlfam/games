-- Table to store manual overrides for game metadata
create table if not exists public.game_overrides (
  slug text primary key,
  seo_title text,
  seo_description text,
  custom_tags text[], -- Array of strings
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.game_overrides enable row level security;

-- Policy: Allow read access to everyone
create policy "Allow public read access"
  on public.game_overrides for select
  using (true);

-- Policy: Allow write access to authenticated users only (admins)
-- You might want to restrict this further to specific emails
create policy "Allow authenticated update"
  on public.game_overrides for all
  using (auth.role() = 'authenticated');
