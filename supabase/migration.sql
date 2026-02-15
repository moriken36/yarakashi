create table posts (
  id uuid default gen_random_uuid() primary key,
  name text not null check (char_length(name) <= 20),
  body text not null check (char_length(body) <= 300),
  ticker text not null,
  created_at timestamptz default now(),
  displayed boolean default false
);

alter table posts enable row level security;
create policy "Anyone can read" on posts for select using (true);
create policy "Anyone can insert" on posts for insert with check (true);

-- Enable realtime for this table
alter publication supabase_realtime add table posts;
