const bcrypt = require('bcryptjs');

async function register(req, res) {
  const { username, password } = req.body;
  const db = req.app.get('db');
  const result = await db.user.find_user_by_username(username);
  const userInDatabase = result[0];
  if (userInDatabase) {
    return res.status(406).json('That username is Taken!');
  }
  const salt = await bcrypt.genSaltSync(10);
  const hash = await bcrypt.hash(password, salt);

  const newUser = await db.user.create_user([
    username,
    hash,
    `https://robohash.org/${username}.png`,
  ]);
  const user = newUser[0];
  req.session.user = {
    username: user.username,
    profilePic: user.profile_pic,
    id: user.id,
  };
  res.status(200).json(req.session.user);
}

async function login(req, res) {
  const { username, password } = req.body;
  const db = req.app.get('db');
  const result = await db.user.find_user_by_username(username);
  const user = result[0];
  if (!user) {
    return res.status(401).json('User not found');
  }
  const isAuthenticated = await bcrypt.compare(password, user.password);
  if (!isAuthenticated) {
    return res.status(403).json('Wrong password, I know this is bad practice');
  }
  req.session.user = {
    username: user.username,
    profilePic: user.profile_pic,
    id: user.id,
  };
  res.status(200).json(req.session.user);
}

function getUser(req, res) {
  const user = req.session.user;
  if (!user) {
    return res.status(404).json('User not found!');
  }
  res.status(200).json(user);
}

function logout(req, res) {
  req.session.destroy();

  res.status(200).json('Logged out');
}

module.exports = {
  register,
  login,
  getUser,
  logout,
};
