// DEFINING MODULES
const express = require("express");
const exphbs = require("express-handlebars");
const handlebars = require("handlebars");
const bodyParser = require("body-parser");
const db = require("./models");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const session = require("express-session");

// DEFINING PORT
const PORT = process.env.PORT || 8080;

// DEFINING INSTANCE OF EXPRESS
const app = express();

// POST REQUEST MIDDLEWARE
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(bodyParser.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// STATIC MIDDLEWARE
app.use(express.static("public"));

// HANDLEBARS MIDDLEWARE
// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(handlebars),
  })
);
app.set("view engine", "handlebars");

app.use(cookieParser());

// app.use(express.session({ secret: 'SECRET' }));
app.use(
  session({
    secret: "secret", // session secret
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ROUTE MODULE CONNECTION
require("./routes/html-routes")(app);
require("./routes/api-routes.js")(app);
// require("./routes/auth-routes.js")(app);

// LISTEN ON SERVER
// db.sequelize.sync({ force: true }).then(() => {
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening at: http://localhost:${PORT}`);
  });
});

passport.serializeUser(function (user, done) {
  console.log("serialize")
  console.log(user);
  done(null, user.username);
});
passport.deserializeUser(function (username, done) {
  console.log("deserialize");
  done(null, {username: username})
});

passport.use(
  new LocalStrategy(function (username, password, done) {
    console.log(username + " " + password);
    db.Project.findOne({
      where: { id: username, projectPassword: password },
    }).then((user) => {
      if (!user) {
        return done(null, false, { message: "Incorrect password." });
      }
      console.log(user);
      return done(null, {username: user.dataValues.id});
    });
  })
);

app.post("/login", function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.json(false); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.json(true);
    });
  })(req, res, next);
});
