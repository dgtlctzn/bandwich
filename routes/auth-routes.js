const passport = require("passport");


module.exports = function (app) {
  app.post("/login", function (req, res, next) {
    // if LocalStrategy (in server.js) is succesful send boolean to prompt redirect or if failed alert user
    passport.authenticate("local", function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.json(false);
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        return res.json(true);
      });
    })(req, res, next);
  });

  app.post("/signup", function (req, res, next) {
    // if LocalStrategy (in server.js) is succesful send boolean to prompt redirect or if failed alert user
    passport.authenticate("local", function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.json(false);
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        return res.json(true);
      });
    })(req, res, next);
  });
};
