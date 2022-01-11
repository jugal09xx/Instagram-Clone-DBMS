const express = require("express");
const pool = require("../db");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authCheck");

const usersRouter = express.Router();

//RETURN DETAILS FOR CURRENT AUTHENTICATED USER
usersRouter.get("/",authenticateToken, async(req, res) => {
  try {
    let currentUser = null;

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      currentUser = req.user;
    });
    const userData = await pool
      .query("SELECT * FROM users WHERE username = $1", [currentUser.name])

    const dataToSend = {
      'username': userData.rows[0].username,
      'followers': userData.rows[0].followers
    }
      res.status(200).json(dataToSend)
  } catch (err) {
    res.status(400).json(err)
  }
});


//ADD A NEW USER (FOR TESTING)
usersRouter.post("/new", async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const newUser = await pool.query(
      "INSERT INTO users(username,password,email) VALUES ($1,$2,$3) RETURNING userid, username, email, followers",
      [userName, password, email]
    );

    res.json(newUser.rows);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = usersRouter;
