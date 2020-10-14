// DEFINING MODULES
const express = require("express");
const exphbs = require("express-handlebars");

// DEFINING PORT
const PORT = process.env.PORT || 8080;

// DEFINING INSTANCE OF EXPRESS
const app = express();

// POST REQUEST MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// STATIC MIDDLEWARE
app.use(express.static("public"));

// HANDLEBARS MIDDLEWARE
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// ROUTE MODULE CONNECTION
const router = require("./controllers/controller");

// LISTEN ON SERVER
app.listen(PORT, () => {
    console.log(`App listening at: http://localhost:${PORT}`)
})