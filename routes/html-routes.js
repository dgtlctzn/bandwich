const db = require("../models");
const randomWords = require('random-words');

module.exports = function (app) {
  app.get("/", (req, res) => {
    res.render("index");
  });
  
  app.get("/projects", (req, res) => {
    res.render("songs-dir");
  });

  app.get("/workstation", (req, res) => {
    // When 'New Project' is selected it...
    // const temporaryName = "Project " + Date.now(); // date.now generates a unique string of numbers for the project name
    const temporaryName = randomWords({ exactly: 3, join: '-' });
    // creates a database,
    db.Project.create({
      projectName: temporaryName,
      projectPassword: "password",
    }).then(() => {
      // retrieves the id of that database,
      db.Project.findOne({
        where: {
          projectName: temporaryName,
        },
      }).then((project) => {
        // and then displays it via handlebars
        res.render("workstation", { project: project });
      });
    });
  });

  app.get("/workstation/:id", (req, res) => {
    console.log(req.params.id)
    db.Project.findOne({
      where: {
        id: req.params.id,
      },
    }).then((project) => {
      // and then displays it via handlebars
      res.render("workstation", { project: project });
    });
  });
};