const express = require("express");
const pool = require("../db");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authCheck");

const commentsRouter = express.Router();

commentsRouter.post("/:id", async (req, res) => {
  try {
    const postId = Number(req.params.id);

    const { comment } = req.body;

    const newComment = await pool.query(
      "INSERT INTO comments(postid, comment) VALUES ($1,$2) RETURNING commentid",
      [postId, comment]
    );
    res.status(200).json(newComment.rows[0])
    
  } catch (err) {
    res.status(400).json(err)
  }
});

module.exports = commentsRouter;
