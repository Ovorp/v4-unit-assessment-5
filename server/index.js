require('dotenv').config();

const express = require('express');
const massive = require('massive');
const session = require('express-session');

const { register, login, getUser, logout } = require('./controllers/user');
const {
  readPosts,
  createPost,
  readPost,
  deletePost,
} = require('./controllers/posts');
//   userCtrl = require('./controllers/user'),
//   postCtrl = require('./controllers/posts')
const { CONNECTION_STRING, SECRET, SERVER_PORT } = process.env;

const app = express();

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

massive({
  connectionString: CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
})
  .then((dbInstance) => {
    app.set('db', dbInstance);
    console.log('database running');
  })
  .catch((err) => console.log(err));

app.use(express.json());

//Auth Endpoints
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/me', getUser);
app.post('/api/auth/logout', logout);

//Post Endpoints
app.get('/api/posts', readPosts);
app.post('/api/post', createPost);
app.get('/api/post/:id', readPost);
app.delete('/api/post/:id', deletePost);

app.listen(SERVER_PORT, () => console.log(`running on ${SERVER_PORT}`));
