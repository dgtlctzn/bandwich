$(document).ready(function () {
  // jQuery targeting the big record/pause/stop buttons
  // feel free to change html ids to match those in handlebars.
  const mainRecordEl = $("#main-record");
  const mainStopEl = $("#main-stop");
  const mainPauseEl = $("#main-pause");
  const saveTrackEl = $("#name-input");
  const editTrackEl = $("#new-name")
  const newProjectEl = $("#new-project");

  // click events on the big record/pause/stop buttons
  mainRecordEl.on("click", startRecord);
  mainStopEl.on("click", stopRecord);
  mainPauseEl.on("click", pauseRecord);

  URL = window.URL || window.webkitURL;

  let gumStream;
  let rec;
  let input;
  let track;

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
    $.ajax({
      url: "/api/audio",
      type: "POST",
      data: data,
    })
      .then(function (response) {
        console.log(response);
        // sets an interval before reloading page to allow big POST request
        setTimeout(function() {
          location.reload();
        }, 3000);
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
        id: $("#proj-name").data("id"),
        track: track
      });
    };
  }

  let switchStatus = false;
  $(".check").on("change", function () {
    if ($(this).is(":checked")) {
      switchStatus = $(this).is(":checked");
      track = $(this).data("track");
    } else {
      switchStatus = $(this).is(":checked");
    }
  });

  // When new project button is clicked it sends user info (IP adress at some point...)
  // Promise is a reassign for the created project
  newProjectEl.on("click", function() {
    $.ajax("/api/project", {
      type: "POST",
      data: "userIpAddress"
    }).then(function(project) {
      location.assign("/workstation/" + project.id);
    });
  });

  saveTrackEl.on("click", function() {
    console.log(this.children[0].innerHTML);
    var currentTitle = this.children[0].innerHTML;
    $("#proj-name").hide();
    $("#new-name").show();
    $("#new-name").val(currentTitle);
    $("#new-name").focus();
  })

  editTrackEl.on("blur", function() {
    $("#new-name").hide();
    $("#proj-name").show();
  })
  // when a user hits the save button it captures the text in the form and posts the song name
  // the post route in api-routes.js creates a new project in the database
  saveTrackEl.on("submit", function(event) {
    event.preventDefault()

    const projectName = {
      name: $("#new-name").val(),
      id: $("#proj-name").data("id")
    }

    $.ajax("/api/project", {
      type: "PUT",
      data: projectName
    }).then(function(project) {
      location.assign("/workstation/" + project);
    });
  })
  // PLAY BTN FOR EACH TRACK
  // ========================================================
  const playBtn1 = $("#playBtn1");
  const playBtn2 = $("#playBtn2");
  const playBtn3 = $("#playBtn3");
  const playBtn4 = $("#playBtn4");
  const audioId1 = $("#audio1");
  const audioId2 = $("#audio2");
  const audioId3 = $("#audio3");
  const audioId4 = $("#audio4");
  var count1 = 0;
  var count2 = 0;
  var count3 = 0;
  var count4 = 0;
  var playPauseReset = 2;
  const audioSrc1 = audioId1.attr("src");
  const audio1 = new Audio(audioSrc1);
  const audioSrc2 = audioId2.attr("src");
  const audio2 = new Audio(audioSrc2);
  const audioSrc3 = audioId3.attr("src");
  const audio3 = new Audio(audioSrc3);
  const audioSrc4 = audioId4.attr("src");
  const audio4 = new Audio(audioSrc4);

  playBtn1.on("click", function () {
    if (count1 === 0) {
      playAudio();
      console.log("Playing");
    } else if (count1 === 1) {
      pauseAudio();
      console.log("Stopping");
    }

    count1 += 1 

    if (count1 === playPauseReset)
        count1 = 0

    function playAudio() {
          audio1.play();
    };
    function pauseAudio() {
          audio1.pause();
    };
  });

  playBtn2.on("click", function () {
    if (count2 === 0) {
      playAudio();
      console.log("Playing");
    } else if (count2 === 1) {
      pauseAudio();
      console.log("Stopping");
    }

    count2 += 1 

    if (count2 === playPauseReset)
        count2 = 0

    function playAudio() {
          audio2.play();
    };
    function pauseAudio() {
          audio2.pause();
    };
  });

  playBtn3.on("click", function () {
    if (count3 === 0) {
      playAudio();
      console.log("Playing" );
    } else if (count3 === 1) {
      pauseAudio();
      console.log("Stopping");
    }

    count3 += 1 

    if (count3 === playPauseReset)
        count3 = 0

    function playAudio() {
          audio3.play();
    };
    function pauseAudio() {
          audio3.pause();
    };
  });
    

  playBtn4.on("click", function () {
    if (count4 === 0) {
      playAudio();
      console.log("Playing");
    } else if (count4 === 1) {
      pauseAudio();
      console.log("Stopping");
    }

    count4 += 1 

    if (count4 === playPauseReset)
        count4 = 0

    function playAudio() {
          audio4.play();
    };
    function pauseAudio() {
          audio4.pause();
    };
  });

  $(".home").on("click", function(){
    location.assign("/");
  })
});
