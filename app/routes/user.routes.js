const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

/**
 * user routes
 * @param {*} app 
 *  return {*} return funciton
 */
module.exports = function(app) {

  app.use(function(req, res, next) {

    res.header(
      "Access-Control-Allow-Headers",
      "jwttoken, Origin, Content-Type, Accept"
    );

    next();

  });

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);
};
