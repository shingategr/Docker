const config = require('../config/auth.config');

const db = require('../models');

const User = db.user;
const Role = db.role;

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

/**
 * user signup method
 * @param {*} req
 * @param {*} res
 *  return {*} return funciton
 */
exports.signup = async (req, res) => {
  const responseJson = {};

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    createdDate: new Date(),
    status: 1,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  await user.save().catch((err) => {
    console.error('error log', err);
    responseJson.status = 1;
    responseJson.error = '';
    return res.json(responseJson);
  });

  // find info from role db
  const role = await Role.findOne({
    name: 'user',
  })
    .exec()
    .catch((err) => {
      console.error('error log', err);
      responseJson.status = 1;
      responseJson.error = `generated error when findOne record ${err}`;
      res.status(500).send(responseJson);
    });

  user.roles = [role._id];
  await user.save().catch((err) => {
    console.error('error log', err);
    responseJson.status = 1;
    responseJson.error = `generated error when role update! ${err}`;
    return res.send(responseJson);
  });

  responseJson.status = 0;
  responseJson.error = 'User was registered successfully!';
  res.send(responseJson);
};

/**
 * user login method
 * @param {*} req
 * @param {*} res
 *  return {*} return funciton
 */
exports.signin = async (req, res) => {
  const responseJson = {};

  if (
    req.body.username === undefined ||
    req.body.username === 'undefined' ||
    req.body.username === ''
  ) {
    responseJson.status = 1;
    responseJson.error = `Username required`;
    return res.status(401).send(responseJson);
  }

  if (
    req.body.password === undefined ||
    req.body.password === 'undefined' ||
    req.body.password === ''
  ) {
    responseJson.status = 1;
    responseJson.error = `Password required`;
    return res.status(401).send(responseJson);
  }

  // find info from user and populate with role db
  const condition = {};
  condition.status = 1;
  condition.username = req.body.username;
  const user = await User.findOne(condition)
    .populate('roles', '-__v')
    .exec()
    .catch((err) => {
      console.error('error log', err);
      responseJson.status = 1;
      responseJson.error = `generated error when find role table ${err}`;
      res.status(500).send(responseJson);
    });

  if (!user) {
    responseJson.status = 1;
    responseJson.error = `User Not found.`;
    return res.status(404).send(responseJson);
  }
  const passwordIsValid = await bcrypt.compareSync(
    req.body.password,
    user.password,
  );

  if (!passwordIsValid) {
    responseJson.status = 1;
    responseJson.error = `Invalid Password!`;
    return res.status(401).send(responseJson);
  }

  const token = await jwt.sign(
    {
      id: user.id,
    },
    config.secret,
    {
      expiresIn: 86400, // 24 hours
    },
  );

  responseJson.status = 0;
  responseJson.id = user._id;
  responseJson.username = user.username;
  responseJson.email = user.email;
  responseJson.accessToken = token;
  responseJson.error = `User record get`;
  res.status(200).send(responseJson);
};
