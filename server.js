// DEFINING MODULES
const express = require("express");
const exphbs = require("express-handlebars");
const handlebars = require("handlebars");
const bodyParser = require("body-parser");
const db = require("./models");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

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

// ROUTE MODULE CONNECTION
require("./routes/html-routes")(app);
require("./routes/api-routes.js")(app);

// LISTEN ON SERVER
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening at: http://localhost:${PORT}`);
  });
});
