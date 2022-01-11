const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(" ")[1]
  if(token == null) res.sendStatus(401).json({
    message: 'No token sent along with request!'
  })

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if(err) return res.sendStatus(403)
    req.user = user
    console.log(user)
    next()
  })
}

module.exports = authenticateToken;