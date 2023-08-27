const jwt = require('jsonwebtoken');
const User = require('./db/User');
const { compareSync } = require('bcrypt');

exports.authenticateToken = (req, res, next) => {
  const token = req.cookies.APP_TOKEN;
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err) return res.send('unauthorized').status(403);
    req.user = user;
    next();
  })
}

exports.createAuthToken = (req, res, next) => {
  const {username, password} =  req.body
  if(req.path === '/login') {
    const user = User.findOneByUsername(username);
    if (!user) return res.send('Invalid Username');
    if (!compareSync(user.password, password)) return res.send('unauthorized');
  }

  const user = { name: username };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 60 * 60}); // 1 hr expiry
  
  res.cookie("APP_TOKEN", accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 // 1 hr expiry
    })
  next();
}