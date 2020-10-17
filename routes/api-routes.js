const db = require("../models");
const randomWords = require("random-words");
const curatedRandomWords = [
  "bazooka",
  "bubblegum",
  "jellyfish",
  "lightning",
  "rainbow",
  "whiskey",
  "beetroot",
  "lawnmower",
  "bathsalts",
  "anteater",
  "grandfather",
  "broccoli",
  "mainframe",
  "deadbolt",
  "spatula",
  "daffodil",
  "crumpet",
  "elephant",
];

module.exports = function (app) {
  app.get("/api/projects/:name", (req, res) => {
    if (req.params.name) {
      db.Project.findOne({
        where: {
          projectName: req.params.name,
        },
      }).then((project) => {
        res.json(project);
      })
    } 
  });


  app.post("/api/project", (req, res) => {
    // const temporaryName = "Project " + Date.now(); // date.now generates a unique string of numbers for the project name
    // const temporaryName = randomWords({ exactly: 3, join: "-" });
    let randomString = "";
    for (let i = 0; i < 3; i++) {
      randomWord =
        curatedRandomWords[
          Math.floor(Math.random() * curatedRandomWords.length)
        ];
      randomString = randomString + randomWord + "-";
    }
    const temporaryName = randomString.slice(0, -1);
    
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

  app.post("/api/audio", (req, res) => {
    db.Audiofile.create({
      audiotext: req.body.audio,
      path: req.body.path,
      ProjectId: req.body.id,
    })
      .then(() => {
        res.end();
      })
      .catch((err) => {
        if (err) throw err;
      });
  });
};
