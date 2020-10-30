-- First, remove the table if it exists
drop table if exists items;
-- Create the table
create table items (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  rating INTEGER NOT NULL
);