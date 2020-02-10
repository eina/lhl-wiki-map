$(() => {
  /* Save a Map */

  /* Edit Place Details */
  const editPlaceBtn = $(".edit-place");

  editPlaceBtn.click(function(event) {
    const formParent = $(this);
    console.log("hey do you know where you are", $(this));

    // i want to replace card innards with a form
  });

  /* Profile Select Thing */
  const $profileSelect = $("#profile-view-select");
  const renderProfileSections = function(e) {
    const $selectVal = $(this).val();
    const $userContainer = $("#user-container");
    const renderCard = () => {
      const $card = $("<div>").addClass("card s-rounded");
      const $cardImg = $("<div>").addClass("card-image");
      const $cardHeader = $("<div>").addClass("card-header");
      const $cardTitle = $("<div>")
        .addClass("card-title h5")
        .text("Map Title");
      const $mapFaves = $("<p>")
        .addClass("map-faves")
        .text(999);

      const $pointImg = $("<img>").attr({ src: "https://picsum.photos/800/500" });

      $cardImg.append($pointImg);
      $cardHeader.append($cardTitle, $mapFaves);

      $card.append($cardImg, $cardHeader);

      return $card;
    };

    const renderActivityTable = () => {
      const $table = $("<table>").addClass("table table-striped table-hover");
      const $thead = $("<thead>").append(`<tr><th>Date</th><th>Details</th></tr>`);
      const $tr = $("<tr>");

      // loop through something
      const $td1 = $("<td>").text("January 24, 2020");
      const $mapLink = $("<a>")
        .attr({ href: "#" })
        .text("[Map Name]");
      const $td2 = $("<td>").append("Edited ", $mapLink);

      const $activeRow = $tr.addClass("active").append($td1, $td2);
      const $tbody = $("<tbody>").append($activeRow);

      $table.append($thead, $tbody);
      return $table;
    };

    // remove content inside
    $userContainer.empty();
    if ($selectVal === "my-maps") {
      const $card = renderCard();
      const $gridHeader = `<h2 class="grid-header">My Maps</h2>`;
      const $cardGrid = $(`<div class="card-grid"></div>`).prepend($card);

      $userContainer.append($gridHeader, $cardGrid);
    }
    if ($selectVal === "my-faves") {
      const $card = renderCard();
      const $gridHeader = `<h2 class="grid-header">Favourites</h2>`;
      const $cardGrid = $(`<div class="card-grid"></div>`).prepend($card);

      $userContainer.append($gridHeader, $cardGrid);
    }

    if ($selectVal === "my-activity") {
      const $gridHeader = `<h2 class="grid-header">Activity</h2>`;
      const $table = renderActivityTable();

      $userContainer.append($gridHeader, $table);
      //   $userContainer.append(`
      // <table class="table table-striped table-hover">
      //   <thead>
      //     <tr>
      //       <th>Date</th>
      //       <th>Details</th>
      //     </tr>
      //   </thead>
      //   <tbody>
      //     <tr class="active">
      //       <td>January 24, 2020</td>
      //       <td>Edited <a href="#">[Map Name]</a></td>
      //     </tr>
      //   </tbody>
      // </table>`);
    }
  };

  if ($profileSelect) {
    $profileSelect.on("change", renderProfileSections);

    // set the default selected option
    // trigger change to load content for that
    $profileSelect.val("my-maps").trigger("change");
  }

  /* Leaflet Shared Map? */
  /* Leaflet: View Map With Points (on single-map.ejs) */
  const renderSingleMap = function() {
    // render map
    const myMap = L.map("leaflet-map").setView([49.280571, -123.11378], 15);
    const yvrMap = L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhlbGl0dGxlYmxhY2tzbWl0aCIsImEiOiJjazZlMnExanYwaXU0M2tsb2I5cDRzcTQwIn0.bwS19as5AZCy7I-y3w-Tkw",
      {
        maxZoom: 19,
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: "mapbox/streets-v11"
      }
    );
    yvrMap.addTo(myMap);
    // render markers
    L.marker([49.280571, -123.11378])
      .bindPopup("Hopefully details here")
      .addTo(myMap);
    L.marker([49.282656, -123.126912])
      .bindPopup("Hopefully details here")
      .addTo(myMap);
    L.marker([49.285944, -123.134379])
      .bindPopup("Hopefully details here")
      .addTo(myMap);
  };
  renderSingleMap();

  /* Leaflet: Create Map (on map-form.ejs) */
  const createMap = L.map("leaflet-map").setView([49.280571, -123.11378], 15);
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhlbGl0dGxlYmxhY2tzbWl0aCIsImEiOiJjazZlMnExanYwaXU0M2tsb2I5cDRzcTQwIn0.bwS19as5AZCy7I-y3w-Tkw",
    {
      maxZoom: 19,
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: "mapbox/streets-v11"
    }
  ).addTo(createMap);

  const onMapClick = function(e) {
    const { lat, lng } = e.latlng;
    const popup = L.popup({
      minWidth: 250,
      keepInView: true
    });
    // on click open this popup
    popup
      .setLatLng(e.latlng)
      // put a form in here to submit stuff
      .setContent(
        `
      <form id="addPlace">
        <div class="form-group">
          <label for="place-name" class="form-label">Name</label>
          <input type="text" class="form-input" id="place-name" name="place-name" />
        </div>
        <div class="form-group">
          <label for="place-img" class="form-label">Image URL</label>
          <input type="text" class="form-input" id="place-img" name="place-name" />
        </div>
        <div class="form-group">
          <label for="place-desc" class="form-label">Description</label>
          <textarea class="form-input" id="place-desc" placeholder="Textarea" rows="3"></textarea>
        </div>
      <button type="submit" class="btn btn-primary">Add</button>
      </form>
      `
      )
      .openOn(createMap);

    // submit handler for the form
    if ($("#addPlace")) {
      $("#addPlace").submit(function(event) {
        event.preventDefault();
        // todo: write a POST request
        // add the marker
        const marker = L.marker([lat, lng]).addTo(createMap);
        // bind the popup to the marker
        marker.bindPopup(`<b>Hello world!</b><br>I am a popup on ${lat}, ${lng}.`).openPopup();
        // close the popup form
        createMap.closePopup();
      });
    }
  };

  createMap.on("click touchstart", onMapClick);

  // $.ajax({
  //   method: "GET",
  //   url: "/api/users"
  // }).done(users => {
  //   for (user of users) {
  //     $("<div>")
  //       .text(user.name)
  //       .appendTo($("body"));
  //   }
  // });
});
