const express = require("express");
const pool = require("../db");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authCheck");

const postsRouter = express.Router();

//ADD A NEW POST BY AUTHENTICATED USER
postsRouter.post("/", authenticateToken, async (req, res) => {
  try {
    let currentUser = null;

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      currentUser = req.user;
    });
    const userData = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [currentUser.name]
    );

    const now = new Date();
    const utcDate = now.toUTCString();

    const { title, description } = req.body;
    const newPost = await pool.query(
      "INSERT INTO posts (userid,title,description,created_at) VALUES ($1,$2,$3,$4) RETURNING postid,title,description,created_at",
      [userData.rows[0].userid, title, description, utcDate]
    );

    res.status(200).json(newPost.rows[0]);
  } catch (err) {
    res.status(400).json(err);
  }
});

//DELETE A POST BY ID CREATED BY AUTHENTICATED USER

postsRouter.delete("/:id", authenticateToken, async (req, res) => {
  try {
    let currentUser = null;

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      currentUser = req.user;
    });
    const userData = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [currentUser.name]
    );

    const postId = req.params.id;

    const postToDelete = await pool.query(
      "SELECT * FROM posts WHERE postid = $1",
      [Number(postId)]
    );

    if (postToDelete.rows[0].userid == userData.rows[0].userid) {
      await pool.query(
        "DELETE FROM posts WHERE userid = $1 AND postid = $2 RETURNING userid, postid, title, description, created_at",
        [userData.rows[0].userid, Number(postId)]
      );

      res.status(200).json({
        message: "post deleted successfully",
      });
    } else {
      res.status(400).json({
        message: "unauthorized action!",
      });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

//GET A POST BY ID

postsRouter.get("/:id", authenticateToken, async (req, res) => {
  const postId = req.params.id;

  const requestedPost = await pool.query(
    "SELECT * FROM posts WHERE postid = $1",
    [Number(postId)]
  );

  if (requestedPost.rows[0] != null) {
    res.status(200).json(requestedPost.rows[0]);
  } else {
    res.status(400).json({
      message: "post not found",
    });
  }
});

//GET ALL POSTS

postsRouter.get("/all_posts/:id", authenticateToken, async (req, res) => {
  try {
    const userId = Number(req.params.id);
    console.log(userId)

    const requestedPosts = await pool.query(
      "SELECT * FROM posts WHERE userid = $1",
      [userId]
    );

    if (requestedPosts.rows != null) {
      res.status(200).json(requestedPosts.rows);
    } else {
      res.status(400).json({
        message: "no posts available!",
      });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

//GET ALL POSTS

postsRouter.get("/", authenticateToken, async (req, res) => {
  try {
    
    const requestedPosts = await pool.query(
      "SELECT * FROM posts"
    );

    if (requestedPosts.rows != null) {
      res.status(200).json(requestedPosts.rows);
    } else {
      res.status(400).json({
        message: "no posts available!",
      });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = postsRouter;
