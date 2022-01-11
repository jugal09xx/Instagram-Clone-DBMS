
/* Backend Assignment for REUNION
   Author: Jugal Lad */



//dependencies
require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const cors = require("cors");

//express config
const app = express();

const port = process.env.PORT || 5000;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//import routes
const authRouter = require('./routes/auth')
const followRouter = require('./routes/follow')
const postsRouter = require('./routes/posts')
const commentsRouter = require('./routes/comments')
const usersRouter = require('./routes/users')

//router config
app.use('/api/authenticate', authRouter);
app.use('/api', followRouter);
app.use('/api/posts', postsRouter)
app.use('/api/comment', commentsRouter)
app.use('/api/users', usersRouter)

app.get('/', (req,res) => {
  res.send('hello')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
