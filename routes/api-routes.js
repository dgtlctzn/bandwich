const db = require("../models");

module.exports = function(app) {

    app.post("/api/audio", (req, res) => {
        db.audioFiles.create({
            audioFile: req.body.audio,
            path: req.body.path,
            
        }).then(()=> {

        }).catch(err => {

        })
    });


    //     connection.query(
    //       "INSERT INTO blobber (download, file) VALUES (?, ?)",
    //       [req.body.download, req.body.data],
    //       (err, data) => {
    //         if (err) {
    //           res.sendStatus(500).end();
    //         }
    //         console.log('here')
    //       }
    //     );
    //   });
}