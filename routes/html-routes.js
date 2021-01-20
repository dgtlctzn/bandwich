const db = require("../models");
const WaveFile = require("wavefile").WaveFile;
const fs = require("fs");
const { Op } = require("sequelize");

module.exports = function (app) {
  
  app.get("/projects", (req, res) => {
    db.Project.findAll().then(function(result){
      res.render("songs-dir", { project: result });
    });
  });

  app.get("/pass/:id", (req, res) => {
    console.log(req.params.id)
    db.Project.findOne({where: {id: req.params.id}}).then(project => {
      res.render("project-login", {projectName: project.dataValues.projectName});
    }).catch(err => {
      console.log(err);
    });
  })

  app.get("/setpass/:id", (req, res) => {
    if (!req.user || req.user.userProjectId !== parseInt(req.params.id)) {
      return res.redirect("/pass/" + req.params.id);
    }
    db.Project.findOne({where: {id: req.params.id}}).then(project => {
      res.render("set-password", {projectName: project.dataValues.projectName});
    }).catch(err => {
      console.log(err);
    });
  })

  app.get("/workstation/:id", (req, res) => {
    // checks for Passport.js user credentials tied to req.user
    // if credentials don't match url project id a redirect to password entry is applied
    if (!req.user || req.user.userProjectId !== parseInt(req.params.id)) {
      return res.redirect("/pass/" + req.params.id);
    }
    let track1;
    let track2;
    let track3;
    let track4;
    console.log("this is req.params.id: " + req.params.id);
    db.Project.findOne({
      where: {
        id: req.params.id,
      },
      include: db.Audiofile,
    }).then((project) => {
      for (let file of project.Audiofiles) {
        console.log("This is my track number: " + file.track)
        wav = new WaveFile();
        const wavData = file.audiotext;
        fs.writeFile(
          `./public/audio/audio${file.id}`,
          Buffer.from(wavData.replace("data:audio/wav;base64,", ""), "base64"),
          function () {
            console.log("New audio posted!");
          }
        );
        file.path = `audio/audio${file.id}`;
        if (file.track === 1) {
          track1 = file.path;
        } else if (file.track === 2) {
          track2 = file.path;
        } else if (file.track === 3) {
          track3 = file.path;
        } else if (file.track === 4) {
          track4 = file.path;
        }
      }
      // console.log(project.Audiofiles.track1)
      res.render("workstation", { project: project, track1: track1, track2: track2, track3: track3, track4: track4});
    });
  });

  app.get("/", (req, res) => {
    res.render("index");
  });
};


