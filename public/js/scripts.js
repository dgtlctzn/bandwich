$(document).ready(function () {
  // jQuery targeting the big record/pause/stop buttons
  // feel free to change html ids to match those in handlebars.
  const mainRecordEl = $("#main-record");
  const mainStopEl = $("#main-stop");
  const mainPauseEl = $("#main-pause");
  const saveTrackEl = $("name-input")

  // click events on the big record/pause/stop buttons
  mainRecordEl.on("click", startRecord);
  mainStopEl.on("click", stopRecord);
  mainPauseEl.on("click", pauseRecord);

  URL = window.URL || window.webkitURL;

  let gumStream;
  let rec;
  let input;

  const AudioContext = window.AudioContext || window.webkitAudioContext;

  function startRecord() {
    console.log("record!");
    const audioContext = new AudioContext();

    const constraints = {
      audio: true,
      video: false,
    };

    mainRecordEl.disabled = true;
    mainStopEl.disabled = false;
    mainPauseEl.disabled = false;

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        console.log("getUserMedia success");

        gumStream = stream;

        input = audioContext.createMediaStreamSource(stream);
        // recorder.js constructor
        rec = new Recorder(input, {
          // mono sound
          numChannels: 1,
        });
        //start the recording process
        rec.record();
        console.log("Recording started");
      })
      .catch(function (err) {
        //enable the record button if getUserMedia() fails
        mainRecordEl.disabled = false;
        mainStopEl.disabled = true;
        mainPauseEl.disabled = true;
      });
  }

  function pauseRecord() {
    console.log("Recording paused", rec.recording);
    if (rec.recording) {
      // pause
      rec.stop();
      // here maybe we can target the pause button (mainPauseEl) and get it to blink/change color
    } else {
      // resume
      rec.record();
      // same for here
    }
  }

  function stopRecord() {
    console.log("Recording stopped");
    //disable the stop button, enable the record too allow for new recordings
    mainRecordEl.disabled = false;
    mainStopEl.disabled = true;
    mainPauseEl.disabled = true;
    // stops the recording and gets the track
    rec.stop();
    gumStream.getAudioTracks()[0].stop();
    // creates wav blob and passes blob as argument to the callback
    rec.exportWAV(convertToBase64);
  }

  function postAudio(data) {
    // sends the audio data from the client to the server via POST request
    $.ajax("/api/audio", {
      type: "POST",
      data: data,
    })
      .then(function (response) {
        // maybe location.reload?
        // it takes time for this request to Post so we don't want to refresh the page too fast
        // might need to do a setTimeoutInterval before reloading
      })
      .catch(function (err) {
        if (err) {
          console.log(err);
        }
      });
  }

  function convertToBase64(blob) {
    const fileName = new Date().toISOString() + ".wav";

    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      const base64data = reader.result;
      postAudio({
        // sent to server side app.post
        // contents: req.body.audio and req.body.file
        audio: JSON.stringify(base64data),
        path: fileName,
      });
    };
  }

  // when a user hits the save button it captures the text in the form and posts the song name
  // the post route in api-routes.js creates a nnew project in the database
  saveTrackEl.on("submit", function(event) {
    event.preventDefault()

    const songName = {
      name: $("#lname").val()
    }

    $.ajax("/api/project", {
      type: "POST",
      data: songName
    })
  })
});
