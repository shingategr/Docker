const { authJwt } = require('../middlewares');
const controller = require('../controllers/blogs.controller');

/**
 * blogs routes
 * @param {*} app 
 * return {*} return funciton
 */
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'jwttoken, Origin, Content-Type, Accept',
    );

    next();
  });

  app.post(
    '/api/test/blog-listing',
    [authJwt.verifyToken],
    controller.blogsListing,
  );

  app.post(
    '/api/test/blog-detail',
    [authJwt.verifyToken],
    controller.blogsDetail,
  );

  app.post('/api/test/blog-save',
    [authJwt.verifyToken],
    controller.blogsSave
  );

  app.post(
    '/api/test/blog-update',
    [authJwt.verifyToken],
    controller.blogsUpdate,
  );
};
