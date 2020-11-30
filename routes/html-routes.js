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

  app.get("/projects/:name", (req, res) => {
    if (req.params.name) {
      db.Project.findAll({
        where: {
          projectName: {
            [Op.like]: "%" + req.params.name + "%",
          }
        },
      }).then((projects) => {
        if (projects !== null) {
          res.render("songs-dir", { project: projects });
        } 
      })
    } 
  })

  app.get("/workstation/:id", (req, res) => {
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
      console.log(track1)
      console.log(track2)
      // console.log(project.Audiofiles.track1)
      res.render("workstation", { project: project, track1: track1, track2: track2, track3: track3, track4: track4});
    });
  });

  app.get("/", (req, res) => {
    res.render("index");
  });
};


