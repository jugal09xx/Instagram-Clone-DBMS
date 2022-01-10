CREATE DATABASE social_media_app;

CREATE TABLE users
(
  userId SERIAL PRIMARY KEY,
  userNaem VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE followers
(
  id SERIAL NUMERIC,
  FOREIGN KEY(id) REFERENCES users(userId)

);


CREATE TABLE posts
(

)
