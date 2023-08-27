require('dotenv').config()

const express = require('express');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const auth = require('./auth');

const User = require('./db/User');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.set('view engine', 'ejs');

const posts = [
  {
    username: 'Kyle',
    title: 'Post 1'
  },
  {
    username: 'Jim',
    title: 'Post 2'
  },
  {
    username: 'Saurav',
    title: 'Post 3'
  },
  {
    username: 'Saurav',
    title: 'Post 4'
  }
];

app.get('/posts', auth.authenticateToken, (req, res) => {
  const { user } = req
  const userPost = posts.filter(post => post.username == user.name) 
  return res.json(userPost)
});

app.get('/', (req, res) => {
  console.log(req.path);
  return res.redirect('/login');
});

app.get('/login', (req, res) => {
  return res.render('login')
})


app.post('/login', auth.createAuthToken, (req, res) => {
  res.redirect("/welcome");
});

app.get('/welcome', auth.authenticateToken, (req, res) => res.send("Welcome"));

app.get('/register', (req, res) => res.render('register'))

app.post('/register', auth.createAuthToken, (req, res) => {
  User.saveUser(req.body.username, req.body.password)
  return res.redirect('/welcome');
})

app.listen(3000, () => {
    console.log("Started on 3000");
});
