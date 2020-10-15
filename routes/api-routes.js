const db = require("../models");
const randomWords = require('random-words');

module.exports = function (app) {

  app.get("/api/project/:name", (req, res) => {
    db.Project.findOne({
      where: {
        projectName: req.params.name,
      },
    }).then((project => {
        res.render("workstation", {project: project})
    }));
  });

  app.post("/api/project", (req, res) => {
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
        // and then sends the id to the front end for a redirect
        res.json(project);
      });
    });
  })

  app.put("/api/project", (req,res) => {
    db.Project.update({
      projectName: req.body.name
    },{
      where: {
        id: req.body.id
      }
    }).then(project => {
      res.json(req.body.id);
    })
  })

  app.post("/api/audio", (req, res) => {
    db.Audiofile.create({
      audiotext: req.body.audio,
      path: req.body.path,
      projectId: req.body.id,
    })
      .then(() => {
        res.end();
      })
      .catch((err) => {
        if (err) throw err;
      });
  });
};
