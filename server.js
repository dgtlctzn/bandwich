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

// PASSPORT.JS MIDDLEWARE
app.use(cookieParser());
app.use(
  session({
    secret: "secret", 
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ROUTE MODULE CONNECTION
require("./routes/html-routes")(app);
require("./routes/api-routes.js")(app);
require("./routes/auth-routes.js")(app);

// LISTEN ON SERVER
// db.sequelize.sync({ force: true }).then(() => {
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening at: http://localhost:${PORT}`);
  });
});

// passport user instances
passport.serializeUser(function (project, done) {
  done(null, project.userProjectId);
});

passport.deserializeUser(function (userProjectId, done) {
  done(null, {userProjectId: userProjectId})
});

passport.use(
  new LocalStrategy({
    usernameField: 'userProjectId',
    passwordField: 'password'
  }, function (userProjectId, password, done) {
    // searches for project model with associated id and password
    // if not found reject authentication
    db.Project.findOne({
      where: { id: userProjectId, projectPassword: password },
    }).then((userProject) => {
      if (!userProject) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, {userProjectId: userProject.dataValues.id});
    });
  })
);
