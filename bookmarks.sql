
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
-- insert test data
insert into items(url, title, rating, description)
values
('www.google.com', 'google', 5, 'search engine'),
('www.youtube.com', 'youtube', 4, 'video site'),
('www.imgur.com', 'imgur', 5, 'image hosting'),
('www.netflix.com', 'netflix', 4, 'video streaming'),
('www.thinkful.com', 'thinkful', 3, 'Bootcamps'),
('https://developer.mozilla.org', 'MDN', 5, 'Developer Documentation'),
('https://twitter.com/', 'twitter', 4, 'Social Media'),
('https://facebook.com/', 'facebook', 3, 'Social Media'),
('https://indeed.com/', 'indeed', 4, 'Job Search')


-- multi-row insert statment here

