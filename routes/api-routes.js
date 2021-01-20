const db = require("../models");
const axios = require("axios");
const randomWords = require("random-words");
const curatedRandomWords = [
  "Bazooka",
  "Bubblegum",
  "Jellyfish",
  "Lightning",
  "Rainbow",
  "Whiskey",
  "Beetroot",
  "Lawnmower",
  "Bathsalts",
  "Anteater",
  "Grandfather",
  "Broccoli",
  "Mainframe",
  "Deadbolt",
  "Spatula",
  "Daffodil",
  "Crumpet",
  "Elephant",
  "Bicycle",
  "Einstein",
  "Blues",
  "Rock",
  "Rag"
];

module.exports = function (app) {
  app.post("/api/project", (req, res) => {
    // const temporaryName =
    //   randomWords({
    //     exactly: 1,
    //     wordsPerString: 2,
    //     formatter: (word) => word.slice(0, 1).toUpperCase() + word.slice(1),
    //   })[0] +
    //   " " +
    //   curatedRandomWords[Math.floor(Math.random() * curatedRandomWords.length)];
    // console.log(temporaryName);
    axios({
      method: "GET",
      url: "http://titlegen.us-east-1.elasticbeanstalk.com/api/v1/titlegen?type=song&no=1"
    }).then(songTitle => {
      const temporaryName = songTitle.data.data[0];
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
      .then(() => {
        res.end();
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
