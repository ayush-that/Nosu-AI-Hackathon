drop table if exists conversations cascade;
drop table if exists direct_chats cascade;
drop table if exists chat_messages cascade;

create extension if not exists vector;
SET maintenance_work_mem = '64MB';

create table if not exists conversations (
  id bigint primary key generated always as identity (start with 1),
  question text not null,
  answer text not null,
  embedding vector(768) null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists direct_chats (
  id bigint primary key generated always as identity (start with 1),
  user_id uuid not null,
  status text not null default 'active', -- active, closed
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists chat_messages (
  id bigint primary key generated always as identity (start with 1),
  chat_id bigint references direct_chats(id) on delete cascade,
  sender_type text not null check (sender_type in ('user', 'admin')),
  sender_id uuid not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create or replace function match_questions (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
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
  where 1 - (conversations.embedding <=> query_embedding) > match_threshold
  order by conversations.embedding <=> query_embedding
  limit match_count;
end;
$$;

create index conversations_embedding_idx on conversations
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

alter table conversations enable row level security;
alter table direct_chats enable row level security;
alter table chat_messages enable row level security;

-- Drop existing policies
drop policy if exists "Anyone can insert chats" on direct_chats;
drop policy if exists "Users can view their own chats" on direct_chats;
drop policy if exists "Anyone can insert messages" on chat_messages;
drop policy if exists "Users can view their chat messages" on chat_messages;

-- Drop existing policies and tables
drop policy if exists "Enable insert for users" on direct_chats;
drop policy if exists "Enable read for users and admins" on direct_chats;
drop policy if exists "Enable update for admins" on direct_chats;
drop policy if exists "Enable insert for users and admins" on chat_messages;
drop policy if exists "Enable read for chat participants and admins" on chat_messages;
drop table if exists staff_members;
drop type if exists user_role;

-- Simple policies for direct_chats
create policy "Enable all operations for authenticated users"
  on direct_chats for all
  to authenticated
  using (true)
  with check (true);

-- Simple policies for chat_messages
create policy "Enable all operations for authenticated users"
  on chat_messages for all
  to authenticated
  using (true)
  with check (true); 