-- Run this in Supabase SQL Editor to add the name column
alter table posts add column name text not null default '' check (char_length(name) <= 20);
