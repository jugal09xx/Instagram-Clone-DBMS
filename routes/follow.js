const express = require("express");
const pool = require("../db");
const authenticateToken = require("../middleware/authCheck");
const jwt = require("jsonwebtoken");

const followRouter = express.Router();

//FOLLOW A USER BY ID
followRouter.post("/follow/:id", authenticateToken, async (req, res) => {
  try {
    const userToFollow = await pool.query(
      "SELECT * FROM users WHERE userid = $1",
      [Number(req.params.id)]
    );

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

    const follow = await pool.query(
      "INSERT INTO followers(userid,fname) VALUES ($1,$2) RETURNING fname",
      [userData.rows[0].userid, userToFollow.rows[0].username]
    );

    if (follow.rows[0].fname != null) {
      await pool.query(
        "UPDATE users SET followers = followers + 1 WHERE username = $1",
        [follow.rows[0].fname]
      );
      return res.status(200).json({
        message: "user followed: " + follow.rows[0].fname,
      });
    } else {
      return res.status(400).json("error!");
    }
  } catch (err) {
    res.status(400).json("error" + err);
  }
});

//UNFOLLOW A USER BY ID
followRouter.post("/unfollow/:id", authenticateToken, async (req, res) => {
  try {
    const userToUnfollow = await pool.query(
      "SELECT * FROM users WHERE userid = $1",
      [Number(req.params.id)]
    );

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

    const unfollow = await pool.query(
      "DELETE FROM followers WHERE userid = $1 AND fname = $2 RETURNING fname",
      [userData.rows[0].userid, userToUnfollow.rows[0].username]
    );

    if (unfollow.rows[0].fname != null) {
      await pool.query(
        "UPDATE users SET followers = followers - 1 WHERE username = $1",
        [unfollow.rows[0].fname]
      );
      return res.status(200).json({
        message: "user unfollowed: " + unfollow.rows[0].fname,
      });
    } else {
      return res.status(400).json("error!");
    }
  } catch (err) {
    res.status(400).json("error" + err);
  }
});

module.exports = followRouter;
