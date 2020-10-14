const db = require("../models");

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
    db.Project.create({
      projectName: req.body.name,
      projectPassword: "password",
    })
      .then(() => {
        res.end();
      })
      .catch((err) => {});
  });

  app.post("/api/audio", (req, res) => {
    db.AudioFile.create({
      audioFile: req.body.audio,
      path: req.body.path,
      projectId: req.body.id,
    })
      .then(() => {})
      .catch((err) => {});
  });
};
