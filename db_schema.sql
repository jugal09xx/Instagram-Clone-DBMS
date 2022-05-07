CREATE TABLE users(
userid NUMERIC PRIMARY KEY,
username VARCHAR(255) NOT NULL UNIQUE,
pass VARCHAR(255) NOT NULL,
no_of_followers NUMERIC DEFAULT 0
);

CREATE TABLE follow(
userid NUMERIC,
fname VARCHAR(255),
FOREIGN KEY (userid) REFERENCES users(userid),
FOREIGN KEY (fname) REFERENCES users(username)
);

CREATE TABLE posts(
userid NUMERIC,
postid NUMERIC PRIMARY KEY,
title VARCHAR(255),
des TEXT,
FOREIGN KEY (userid) REFERENCES users(userid)
);

CREATE TABLE comments(
  userid NUMERIc,
  postid NUMERIC,
  content TEXT,
  comment_date DATE,
  FOREIGN KEY (userid) REFERENCES users(userid),
  FOREIGN KEY (postid) REFERENCES posts(postid)
);

CREATE TABLE likes(
  userid NUMERIc,
  postid NUMERIC,
  isLiked BOOLEAN,
  FOREIGN KEY (userid) REFERENCES users(userid),
  FOREIGN KEY (postid) REFERENCES posts(postid)
)


