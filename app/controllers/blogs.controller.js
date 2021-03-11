const db = require('../models');
const jwt = require('jsonwebtoken');
const User = db.user;
const Blogs = db.blogs;

/**
 * Blogs Crud operation record get
 * Blogs all record get
 * @param {*} req
 * @param {*} res
 * return {*} return funciton
 */
exports.blogsListing = async (req, res) => {
  try {
    const responseJson = {};

    // find info from blogs db
    const condition = {};
    condition.status = 1;
    const _resTableData4 = await Blogs.find(condition)
      .exec()
      .catch((err) => {
        console.error('error log', err);
        responseJson.status = 1;
        responseJson.error = `generated error when find record ${err}`;
        res.status(500).send(responseJson);
      });

    if (
      !_resTableData4 ||
      _resTableData4 === undefined ||
      _resTableData4 === 'undefined'
    ) {
      responseJson.status = 1;
      responseJson.error = `Blogs Not found, Please contact to administrator.`;
      return res.status(404).send(responseJson);
    }

    // final response send
    responseJson.status = 0;
    responseJson.data = _resTableData4;
    responseJson.error = 'get all blogs record get.';
    res.status(200).send(responseJson);
  } catch (err) {
    console.log(err);
  }
};

/**
 * Blog Detail record get
 *
 * @param {*} req
 * @param {*} res
 * return {*} return funciton
 */
exports.blogsDetail = async (req, res) => {
  try {
    const responseJson = {};

    if (req.body === undefined && req.body === '') {
      responseJson.status = 1;
      responseJson.error = '';
      return res.json(responseJson);
    }

    if (
      req.body.blogid === undefined ||
      req.body.blogid === 'undefined' ||
      req.body.blogid === ''
    ) {
      responseJson.status = 1;
      responseJson.error = `Blog id required`;
      return res.status(401).send(responseJson);
    }

    // find info from blogs db
    const condition = {};
    condition._id = req.body.blogid;
    condition.status = 1;
    const _resTableData4 = await Blogs.findOne(condition)
      .exec()
      .catch((err) => {
        console.error('error log', err);
        responseJson.status = 1;
        responseJson.error = `generated error when find record ${err}`;
        res.status(500).send(responseJson);
      });

    if (
      !_resTableData4 ||
      _resTableData4 === undefined ||
      _resTableData4 === 'undefined'
    ) {
      responseJson.status = 1;
      responseJson.error = `Blogs Not found, Please contact to administrator.`;
      return res.status(404).send(responseJson);
    }

    // final response send
    responseJson.status = 0;
    responseJson.data = _resTableData4;
    responseJson.error = 'get detail blogs record get.';
    res.status(200).send(responseJson);
  } catch (err) {
    console.log(err);
  }
};

/**
 * Blog Save record get
 *
 * @param {*} req
 * @param {*} res
 * return {*} return funciton
 */
exports.blogsSave = async (req, res) => {
  try {
    const responseJson = {};

    if (req.body === undefined && req.body === '') {
      responseJson.status = 1;
      responseJson.error = '';
      return res.json(responseJson);
    }

    const token = await req.headers['jwttoken'];

    let decoded = jwt.decode(token);
    // get the decoded payload and header
    decoded = jwt.decode(token, { complete: true });
    const userId = decoded.payload.id;

    const blogs = new Blogs({
      title: req.body.title,
      description: req.body.description,
      author: userId,
      comments: req.body.comments,
      status: 1,
      roles: req.body.roles,
      createdDate: new Date(),
    });

    await blogs.save().catch((err) => {
      console.error('error log', err);
      responseJson.status = 1;
      responseJson.error = '';
      return res.json(responseJson);
    });

    // final response send
    responseJson.status = 0;
    responseJson.data = '';
    responseJson.error = 'Blog save successfully.';
    res.status(200).send(responseJson);
  } catch (err) {
    console.log(err);
  }
};

/**
 * Blog Update record get
 *
 * @param {*} req
 * @param {*} res
 * return {*} return funciton
 */
exports.blogsUpdate = async (req, res) => {
  try {
    const responseJson = {};

    if (req.body === undefined && req.body === '') {
      responseJson.status = 1;
      responseJson.error = '';
      return res.json(responseJson);
    }

    const filter = { _id: req.body.blogid };
    const update = {
      title: req.body.title,
      description: req.body.description,
      comments: req.body.comments,
    };

    // first find and update record
    const doc = await Blogs.findOneAndUpdate(filter, update);

    if (!doc || doc === undefined || doc === 'undefined') {
      responseJson.status = 1;
      responseJson.error = `Blogs Update Record Not found, Please contact to administrator.`;
      return res.status(404).send(responseJson);
    }

    // final response send
    responseJson.status = 0;
    responseJson.data = update;
    responseJson.error = 'Blog update successfully.';
    res.status(200).send(responseJson);
  } catch (err) {
    console.log(err);
  }
};
