const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const db = require('../models');
const User = db.user;
const Role = db.role;

/**
 * verify jwt token method
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 *  return {*} return funciton
 */
const verifyToken = async (req, res, next) => {
  const responseJson = {};

  const token = await req.headers['jwttoken'];

  if (!token) {
    responseJson.status = 1;
    responseJson.error = 'No token provided!';
    return res.status(403).send(responseJson);
  }


  // checking or verify jwt
  await jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      responseJson.status = 1;
      responseJson.error = 'Your passing token is Unauthorized!';
      return res.status(401).send(responseJson);
    }

    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'admin') {
            next();
            return;
          }
        }

        res.status(403).send({ message: 'Require Admin Role!' });
        return;
      },
    );
  });
};

const isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'moderator') {
            next();
            return;
          }
        }

        res.status(403).send({ message: 'Require Moderator Role!' });
        return;
      },
    );
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
};
module.exports = authJwt;
