const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../db')

const authRouter = express.Router();


authRouter.post('/', async(req,res) => {
  try {
    
    const { email, password } = req.body;

    const authUser = await pool.query('SELECT * FROM users WHERE email = $1',[email])

    //user doesnt exist in db
    if(authUser.rows[0] == null){
      res.status(400).json({
        'message': 'user does not exist'
      })
    }

    //user authenticated
    if(authUser.rows[0].password == password){
      

      const user = { name: authUser.rows[0].username };
      const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN)

      res.json({ accessToken: accessToken })

    //wrong credentials
    } else {
      res.status(400).json({
        message: 'wrong credentials'
      })
    }

  } catch (err) {
    console.log(err)
  }

})

module.exports = authRouter;