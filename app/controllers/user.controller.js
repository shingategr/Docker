const db = require('../models');
const jwt = require('jsonwebtoken');
const Role = db.role;
const User = db.user;

/**
 * user record get
 *
 * @param {*} req
 * @param {*} res
 * return {*} return funciton
 */

exports.userBoard = async (req, res) => {
  try {
    const responseJson = {};

    const token = await req.headers['jwttoken'];

    let decoded = jwt.decode(token);
    // get the decoded payload and header
    decoded = jwt.decode(token, { complete: true });
    const userId = decoded.payload.id;

    // find info from user db
    const condition = {};
    condition._id = userId;
    const _resTableData4 = await User.findOne(condition)
      .exec()
      .catch((err) => {
        console.error('error log', err);
        responseJson.status = 1;
        responseJson.error = `generated error when findOne record ${err}`;
        res.status(500).send(responseJson);
      });

    if (
      !_resTableData4 ||
      _resTableData4 === undefined ||
      _resTableData4 === 'undefined'
    ) {
      responseJson.status = 1;
      responseJson.error = `User Not found, Please contact to administrator.`;
      return res.status(404).send(responseJson);
    }

    responseJson.status = 0;
    responseJson.data = _resTableData4;
    responseJson.error = 'user record get.';
    // final response send
    res.status(200).send(responseJson);
  } catch (err) {
    console.log(err);
  }
};
