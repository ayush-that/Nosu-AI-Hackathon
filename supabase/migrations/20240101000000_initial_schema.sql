-- Create profiles table
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    full_name text,
    avatar_url text,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Create policy to allow users to view their own profile
create policy "Users can view own profile"
on public.profiles for select
using (auth.uid() = id);

-- Create policy to allow users to update their own profile
create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id);

-- Create policy to allow users to insert their own profile
create policy "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, email, full_name)
    values (new.id, new.email, new.raw_user_meta_data->>'full_name');
    return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create profile on signup
create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Create the conversations table for storing chat history
create table if not exists public.conversations (
    id uuid default gen_random_uuid() primary key,
    question text not null,
    answer text not null,
    embedding vector(1536),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.conversations enable row level security;

-- Create policy to allow public read access
create policy "Allow public read access"
on public.conversations for select
to public
using (true);

-- Create policy to allow public insert access
create policy "Allow public insert access"
on public.conversations for insert
to public
with check (true);

-- Create the similarity search function
create or replace function match_questions(
  query_embedding vector(1536),
  similarity_threshold float,
  match_count int
)
returns table (
  id uuid,
  question text,
  answer text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    conversations.id,
    conversations.question,
    conversations.answer,
    1 - (conversations.embedding <=> query_embedding) as similarity
  from conversations
  where 1 - (conversations.embedding <=> query_embedding) > similarity_threshold
  order by conversations.embedding <=> query_embedding
  limit match_count;
end;
$$; 