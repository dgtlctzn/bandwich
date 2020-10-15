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

  app.put("/api/project", (req,res) => {
    db.Project.update({
      projectName: req.body.name
    },{
      where: {
        id: req.body.id
      }
    })
  })

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
