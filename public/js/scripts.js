$(document).ready(function () {
  // jQuery targeting the big record/pause/stop buttons
  // feel free to change html ids to match those in handlebars.
  const mainRecordEl = $("#main-record");
  const mainStopEl = $("#main-stop");
  const mainPauseEl = $("#main-pause");
  const saveTrackEl = $("#name-input");
  const editTrackEl = $("#new-name");
  const newProjectEl = $("#new-project");

  // click events on the big record/pause/stop buttons
  mainRecordEl.on("click", function () {
    if (track) {
      startRecord();
    } else {
      alert("Please record enable one of the tracks!");
    }
  });
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
        playAll();
        setTimeout(function () {
          rec.record();
        }, 150);
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
        setTimeout(function () {
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
        track: track,
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
  newProjectEl.on("click", function () {
    $.ajax("/api/project", {
      type: "POST",
      data: "userIpAddress",
    }).then(function (project) {
      location.assign("/workstation/" + project.id);
    });
  });

  saveTrackEl.on("click", function () {
    console.log(this.children[0].innerHTML);
    var currentTitle = this.children[0].innerHTML;
    $("#proj-name").hide();
    $("#new-name").show();
    $("#new-name").val(currentTitle);
    $("#new-name").focus();
  });

  editTrackEl.on("blur", function () {
    $("#new-name").hide();
    $("#proj-name").show();
  });
  // when a user hits the save button it captures the text in the form and posts the song name
  // the post route in api-routes.js creates a new project in the database
  saveTrackEl.on("submit", function (event) {
    event.preventDefault();

    const projectName = {
      name: $("#new-name").val(),
      id: $("#proj-name").data("id"),
    };

    $.ajax("/api/project", {
      type: "PUT",
      data: projectName,
    }).then(function (project) {
      location.assign("/workstation/" + project);
    });
  })

  // when user hits the search-btn
$("#projectsearch-btn").on("click", function() {
  // save the character they typed into the character-search input
  var searchedProject = $("#projects-search")
    .val()
    .trim();
  console.log("click works")
  console.log(searchedProject)
  // Using a RegEx Pattern to remove spaces from searchedCharacter
  // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
  searchedProject = searchedProject.replace(/\s+/g, "").toLowerCase();

  // run an AJAX GET-request for our servers api,
  // including the user's character in the url
  $.get("/api/projects/" + searchedProject, function(data) {
    // log the data to our console
    console.log(data);
    console.log("Get works")
    // empty to well-section before adding new content
    $("#results-section").empty();
    // if the data is not there, then return an error message
    if (data) {
      window.location.assign("/projects/" + searchedProject)
    } else {
      window.location.assign("/projects/no-results")
    }
  });
});

  // PLAY BTN FOR EACH TRACK
  // ========================================================
  const mainPlayEl = $("#main-play");
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

  function playAll() {
    if (audioSrc1 !== "/") {
      audio1.load();
      audio1.play();
    }
    if (audioSrc2 !== "/") {
      audio2.load();
      audio2.play();
    }
    if (audioSrc3 !== "/") {
      audio3.load();
      audio3.play();
    }
    if (audioSrc4 !== "/") {
      audio4.load();
      audio4.play();
    }
  }

  mainPlayEl.on("click", function () {
    playAll();
  });

  playBtn1.on("click", function () {
    if (count1 === 0) {
      playAudio();
      playBtn1.removeClass("fas fa-play");
      playBtn1.addClass("fas fa-pause");
      console.log("Playing");
    } else if (count1 === 1) {
      pauseAudio();
      playBtn1.removeClass("fas fa-pause");
      playBtn1.addClass("fas fa-play");
      console.log("Stopping");
    }

    count1 += 1;

    if (count1 === playPauseReset) count1 = 0;

    function playAudio() {
      audio1.play();
      audio1.onended = function () {
        playBtn1.removeClass("fas fa-pause");
        playBtn1.addClass("fas fa-play");
        count1 = 0;
      };
    }
    function pauseAudio() {
      audio1.pause();
    }
  });

  playBtn2.on("click", function () {
    if (count2 === 0) {
      playAudio();
      playBtn2.removeClass("fas fa-play");
      playBtn2.addClass("fas fa-pause");
      console.log("Playing");
    } else if (count2 === 1) {
      pauseAudio();
      playBtn2.removeClass("fas fa-pause");
      playBtn2.addClass("fas fa-play");
      console.log("Stopping");
    }

    count2 += 1;

    if (count2 === playPauseReset) count2 = 0;

    function playAudio() {
      audio2.play();
      audio2.onended = function () {
        playBtn2.removeClass("fas fa-pause");
        playBtn2.addClass("fas fa-play");
        count2 = 0;
      };
    }
    function pauseAudio() {
      audio2.pause();
    }
  });

  playBtn3.on("click", function () {
    if (count3 === 0) {
      playAudio();
      playBtn3.removeClass("fas fa-play");
      playBtn3.addClass("fas fa-pause");
      console.log("Playing");
    } else if (count3 === 1) {
      pauseAudio();
      playBtn3.removeClass("fas fa-pause");
      playBtn3.addClass("fas fa-play");
      console.log("Stopping");
    }

    count3 += 1;

    if (count3 === playPauseReset) count3 = 0;

    function playAudio() {
      audio3.play();
      audio3.onended = function () {
        playBtn3.removeClass("fas fa-pause");
        playBtn3.addClass("fas fa-play");
        count3 = 0;
      };
    }
    function pauseAudio() {
      audio3.pause();
    }
  });

  playBtn4.on("click", function () {
    if (count4 === 0) {
      playAudio();
      playBtn4.removeClass("fas fa-play");
      playBtn4.addClass("fas fa-pause");
      console.log("Playing");
    } else if (count4 === 1) {
      pauseAudio();
      playBtn4.removeClass("fas fa-pause");
      playBtn4.addClass("fas fa-play");
      console.log("Stopping");
    }

    count4 += 1;

    if (count4 === playPauseReset) count4 = 0;

    function playAudio() {
      audio4.play();
      audio4.onended = function () {
        playBtn4.removeClass("fas fa-pause");
        playBtn4.addClass("fas fa-play");
        count4 = 0;
      };
    }
    function pauseAudio() {
      audio4.pause();
    }
  });

  $(".home").on("click", function () {
    location.assign("/");
  });

  $("#destroyBtn1").on("click", function () {
    let gettingID = audioId1.attr("src");
    gettingID = gettingID.split("");
    gettingID = parseFloat(gettingID.pop());

    audioId1.attr("src", "/");

    $.ajax({
      url: `/api/audio/${gettingID}`,
      method: "DELETE",
      success: function () {
        setTimeout(function () {
          location.reload();
        }, 1000);
        console.log(111);
      },
    });
  });

  $("#destroyBtn2").on("click", function () {
    let gettingID = audioId2.attr("src");
    gettingID = gettingID.split("");
    gettingID = parseFloat(gettingID.pop());

    audioId2.attr("src", "/");

    $.ajax({
      url: `/api/audio/${gettingID}`,
      method: "DELETE",
      success: function () {
        setTimeout(function () {
          location.reload();
        }, 1000);
        console.log(111);
      },
    });
  });

  $("#destroyBtn3").on("click", function () {
    let gettingID = audioId3.attr("src");
    gettingID = gettingID.split("");
    gettingID = parseFloat(gettingID.pop());

    audioId3.attr("src", "/");

    $.ajax({
      url: `/api/audio/${gettingID}`,
      method: "DELETE",
      success: function () {
        setTimeout(function () {
          location.reload();
        }, 1000);
        console.log(111);
      },
    });
  });

  $("#destroyBtn4").on("click", function () {
    let gettingID = audioId4.attr("src");
    gettingID = gettingID.split("");
    gettingID = parseFloat(gettingID.pop());

    audioId4.attr("src", "/");

    $.ajax({
      url: `/api/audio/${gettingID}`,
      method: "DELETE",
      success: function () {
        setTimeout(function () {
          location.reload();
        }, 1000);
        console.log(111);
      },
    });
  });
});
