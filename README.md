# 18CSE303J Database Management System 
## Semester Project 

## Problem Statement

The task is to build an API for a social media platform based on NodeJs. The tech-stack for the project is NodeJS, Express and PostgreSQL. This backend project is based on the working of social media sites like Facebook and Instagram which allows users to perform CRUD operations like posting pictures/videos, posting comments, following other users and liking their posts. The API supports operations like: 

- fetch a user profile 
- follow a user
- create a post 
- delete a post
- edit a post 
- like a post 
- unlike a post
- comment on a post
- edit a comment
- delete comment on a post 

The database schema has been designed and implemented in PostgreSQL.

## Database Schema - Tables

### Users 

| user id  | user name | password | followers |
| ------------- | ------------- | ----------- | ----------- | 
| 1101  | jugal.lad  | fda485dja  | 560 |
| 1102  | harsh.pala  | lkx234jk  | 470 |
| 1103  | devendra.bansal  | dsf832xd  | 809 |
| 1104  | arora  |  pwq421kq | 323 |

### Follow 

| user id  | fname |
| ------------- | ------------- | 
| 1101  | devendra.bansal |
| 1101  | harsh.pala |
| 1103  | jugal.lad |
| 1103  | tanmay.arora |
| 1103  | harsh.pala |

### Posts

| user id  | postid | title | date |
| ------------- | ------------- | ----------- | ----------- | 
| 1101  | p103  | Vacation pics  | 13-04-2021 |
| 1101  | p101  | Weekend Trip  | 12-04-2021 |
| 1102  | p104  | Happy Birthday!  | 11-04-2021 |
| 1103  | p106  | Summer Camp | 11-04-2021 |


### Comments

| user id  | postid | content | date |
| ------------- | ------------- | ----------- | ----------- | 
| 1101  | p101  | great picture!  | 13-04-2021 |
| 1101  | p102  | nice smile  | 12-04-2021 |
| 1102  | p102  | beautiful!!  | 11-04-2021 |
| 1103  | p103  |  i love this picture! | 11-04-2021 |

### Likes

| user id  | postid | isLiked |
| ------------- | ------------- | ----------- |
| 1101  | p101  | `true` |
| 1101  | p102  | `true` |
| 1102  | p102  | `true` |
| 1103  | p103  | `true` |


## Database Schema - Code

```
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
);
```


## Database Schema - ER Diagram

[![Screenshot-2022-05-07-151320.png](https://i.postimg.cc/PfvVD6K7/Screenshot-2022-05-07-151320.png)](https://postimg.cc/BtsC9Br5)


## API Endpoints

- POST /api/users/new add a new user
    - INPUT: Email, Name, Password

- POST /api/authenticate should perform user authentication and return a JWT token.
    - INPUT: Email, Password
    - RETURN: JWT token

- POST /api/follow/{id} authenticated user would follow user with {id}
- POST /api/unfollow/{id} authenticated user would unfollow user with {id}

- GET /api/user should authenticate the request and return the respective user profile.
    - RETURN: User Name, number of followers & followings.

- POST api/posts/ would add a new post created by the authenticated user.
    - Input: Title, Description
    - RETURN: Post-ID, Title, Description, Created Time(UTC).

- DELETE api/posts/{id} would delete post with {id} created by the authenticated user.

- POST /api/comment/{id} add comment for post with {id} by the authenticated user.
    - Input: Comment
    - Return: Comment-ID

- GET api/posts/{id} would return a single post with {id} populated with its number of likes and comments
   
- GET /api/all_posts/{id} would return all posts created by a user with {id} sorted by post time.
    - RETURN: For each post return the following values
        - id: ID of the post
        - title: Title of the post
        - desc: Description of the post
        - created_at: Date and time when the post was created
        - comments: Array of comments, for the particular post
        - likes: Number of likes for the particular post

Created by Jugal Lad (11/01/2021) 
