const db = require("../models");

module.exports = function (app) {
  app.get("/api/audio/:id", (req, res) => {
    db.Project.findOne({
      where: {
        id: req.params.id,
      },
    });

    connection.query("SELECT * from blobber", (err, data) => {
      // // data = data.map(item => "audio/" + item.download)
      // console.log(data);
      if (data.length > 0) {
        for (let item of data) {
          // console.log(item.)
          // item.download = "audio/" + item.download;
          wav = new WaveFile();
          const wavData = item.file;
          fs.writeFileSync(
            "./public/audio/" + item.download,
            Buffer.from(wavData.replace("data:audio/wav;base64,", ""), "base64")
          );
          item.download = "audio/" + item.download;
        }
        res.render("index", { audio: data });
      } else {
        res.render("index");
      }
    });
  });

  app.post("api/project", (req, res) => {
    db.Project.create({
      projectName: req.body.name,
      projectPassword: "password",
    });
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
