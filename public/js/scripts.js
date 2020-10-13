$(document).ready(function() {

    const mainRecordEl = $("#main-record");


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
            /* assign to gumStream for later use */
            gumStream = stream;
            /* use the stream */
            input = audioContext.createMediaStreamSource(stream);
            /* Create the Recorder object and configure to record mono sound (1 channel) Recording 2 channels will double the file size */
            rec = new Recorder(input, {
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


})