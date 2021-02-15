$(document).ready(function () {
  const newProjectEl = $("#new-project");
  const projectSearchEl = $("#projectsearch-btn");
  const userSearch = $("#projects-search");
  const songList = $("#activeList");
  const passEl = $("#password");
  const passInput = $("#pass-input");
  const setPassEl = $("#set-password");
  const setPassInput = $("#set-pass-input");

  // When new project button is clicked it sends user info (IP adress at some point...)
  // Promise is a reassign for the created project
  newProjectEl.on("click", function () {
    $.ajax("/api/project", {
      // $.ajax("/signin", {
      type: "POST",
      data: "userIpAddress",
    }).then(function (project) {
      $.post(
        "/auth",
        {
          userProjectId: project.id,
          password: "password",
        },
        function (authenticated) {
          console.log(authenticated);
          if (authenticated) {
            window.location.assign("/setpass/" + project.id);
          } else {
            alert("incorrect password");
          }
        }
      );
    });
  });

  // when user hits the search-btn
  projectSearchEl.on("click", function () {
    const searchedProject = userSearch.val().trim();
    $.get("/api/projects/" + searchedProject, function (projects) {
      songList.empty();

      if (!projects.data.length) {
        noResults = $("<p>").addClass("no-results").text("No results found");
        songList.append(noResults);
      } else {
        // make project link for each returned result
        for (const project of projects.data) {
          const divider = $("<div>").attr("id", "activeListItem");
          const projectEl = $("<a>").attr("href", `/pass/${project.id}`);
          const innerText = $("<p>")
            .addClass("projectName")
            .text(project.projectName);
          projectEl.append(innerText);

          songList.append(divider);
          songList.append(projectEl);
        }
      }
    });
  });

  // authorizes user for specific project depending on correct password
  passEl.on("submit", function (e) {
    e.preventDefault();

    projectId = window.location.href.split("pass/")[1];
    password = passInput.val();

    $.post(
      "/auth",
      {
        userProjectId: projectId,
        password: password,
      },
      function (authenticated) {
        if (authenticated) {
          window.location.assign("/workstation/" + projectId);
        } else {
          const errorMsg = $(".error-message");
          errorMsg.text("Incorrect passcode");
        }
      }
    );
  });

  // authorizes user for new project, sets password for project, redirects to workstation
  setPassEl.on("submit", function (e) {
    e.preventDefault();

    projectId = window.location.href.split("pass/")[1];
    password = setPassInput.val();
    console.log("here");

    if (!password.length || password.length < 5) {
      const errorMsg = $(".error-message");
      errorMsg.text("Passcode must be at least 5 characters");
      return;
    }

    $.ajax("/api/setpass", {
      type: "PUT",
      data: {
        projectId: projectId,
        password: password,
      },
    }).then(function (projectId) {
      console.log(projectId);
      location.assign("/workstation/" + projectId);
    });
  });
});
