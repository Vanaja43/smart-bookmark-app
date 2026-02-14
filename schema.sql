-- Create the bookmarks table
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table bookmarks enable row level security;

-- Create RLS Policies
create policy "Users can only see their own bookmarks"
  on bookmarks for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own bookmarks"
  on bookmarks for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own bookmarks"
  on bookmarks for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own bookmarks"
  on bookmarks for delete
  using ( auth.uid() = user_id );

-- Enable Realtime for the bookmarks table
-- Note: In the Supabase dashboard, you can also do this in the Replication settings
alter publication supabase_realtime add table bookmarks;
