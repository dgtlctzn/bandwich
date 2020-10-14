$(document).ready(function () {
  // jQuery targeting the big record/pause/stop buttons
  // feel free to change html ids to match those in handlebars.
  const mainRecordEl = $("#main-record");
  const mainStopEl = $("#main-stop");
  const mainPauseEl = $("#main-pause");

  URL = window.URL || window.webkitURL;

  let gumStream;
  let rec;
  let input;

  const AudioContext = window.AudioContext || window.webkitAudioContext;

  function startRecording() {
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
        console.log(
          "getUserMedia() success, stream created, initializing Recorder.js ..."
        );

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

  function stopRecording() {
    console.log("Recording stopped");
    //disable the stop button, enable the record too allow for new recordings
    mainRecordEl.disabled = false;
    mainStopEl.disabled = true;
    mainPauseEl.disabled = true;
    // stops the recording and gets the track
    rec.stop(); 
    gumStream.getAudioTracks()[0].stop();
    // creates wav blob and passes blob as argument to the callback
    rec.exportWAV(createDownloadLink);
  }

  function postAudio(data) {
      // sends the audio data from the client to the server via POST request
      $.ajax("/api/audio", {
        type: "POST",
        data: data,
      })
        .then(function(response) {
          // maybe location.reload?
          // it takes time for this request to Post so we don't want to refresh the page too fast
          // might need to do a setTimeoutInterval before reloading
        })
        .catch(function(err) {
            if (err) {
                console.log(err);
            }
        });
    }
});
