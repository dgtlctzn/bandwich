const db = require("../models");
const axios = require("axios");
const { Op } = require("sequelize");


module.exports = function (app) {
  app.post("/api/project", (req, res) => {
    axios({
      method: "GET",
      url: "http://titlegen.us-east-1.elasticbeanstalk.com/api/v1/titlegen?type=song&no=1"
    }).then(songTitle => {
      const temporaryName = songTitle.data.data[0];
      db.Project.create({
        projectName: temporaryName,
        projectPassword: "password",
      }).then((project) => {
        res.json(project);
      });
    }).catch(err => {
      console.log(err);
    })
  });

  app.put("/api/project", (req, res) => {
    db.Project.update(
      {
        projectName: req.body.name,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    ).then((project) => {
      res.json(req.body.id);
    });
  });

  app.get("/api/projects/:name", (req, res) => {
    if (req.params.name) {
      db.Project.findAll({
        where: {
          projectName: {
            // query for all matches that contain req.params.name
            [Op.like]: "%" + req.params.name + "%",
          }
        },
      }).then((foundProjects) => {
        if (foundProjects !== null) {
          const projects = foundProjects.map(project => (
            {id: project.id, projectName: project.projectName}
          ))
          // return db results to front end to be place with jQuery
          res.json({
            error: null,
            data: projects,
            message: `projects searched for '${req.params.name}'`
          })
        } 
      })
    } 
  })

  app.put("/api/setpass", (req, res) => {
    db.Project.update(
      {
        projectPassword: req.body.password,
      },
      {
        where: {
          id: req.body.projectId,
        },
        returning: true
      },
    ).then(() => {
      res.json(req.body.projectId);
    });
  });

  app.delete("/api/audio/:id", (req, res) => {
    console.log(req.params.id);
    db.Audiofile.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then(() => {
        res.end();
      })
      .catch((err) => {
        if (err) throw err;
      });
  });

  app.post("/api/audio", (req, res) => {
    db.Audiofile.create({
      audiotext: req.body.audio,
      path: req.body.path,
      ProjectId: req.body.id,
      track: req.body.track,
    })
      .then((audioRes) => {
        res.json(audioRes);
      })
      .catch((err) => {
        if (err) throw err;
      });
  });

  app.delete("/api/project/:id", (req, res) => {
    console.log(req.params.id);
    db.Project.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then(() => {
        res.end();
      })
      .catch((err) => {
        if (err) throw err;
      });
  });
};
