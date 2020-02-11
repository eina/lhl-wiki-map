/* eslint-disable no-undef */
$(() => {
  /* Log In Modal Functionalities */
  const modalControl = function(event) {
    $("#modal-login").toggleClass("active");
  };
  // toggle modal open and close
  $("#btn-login").click(modalControl);
  $("#modal-close").click(modalControl);

  $("#login-form").submit(function(event) {
    event.preventDefault();
    const query = $(this).serialize();
    $.ajax({
      method: "POST",
      url: "/login",
      data: query
    }).then(data => {
      console.log("hello data?", data);
      // if (data) {
      //   $("#modal-login").removeClass("active");
      //   $("#navbar-user").text(`Hi, ${data.fullname}`);
      // }
    });
  });

  /* Save a Map */

  /* Edit Place Details */
  const editPlaceBtn = $(".edit-place");

  editPlaceBtn.click(function(event) {
    const $placeID = $(this)
      .parent()
      .parent();
    const $placeIDString = $placeID.attr("id");
    const $copyBeforeEdit = $placeID.clone();
    // todo: need the details of this place to be populated!

    const renderEditPlaceForm = placeId => {
      return `<form id="edit-${placeId}">
        <div class="card-body">
          <label class="form-group">
            <span class="form-label">Name</span>
            <input type="text" class="form-input" id="edit-place2-name" name="place-name" />
          </label>
          <label class="form-group">
            <span class="form-label">Image URL</span>
            <input type="text" class="form-input" id="edit-place2-img" name="place-img" />
          </label>
          <label class="form-group">
            <span class="form-label">Description</span>
            <textarea class="form-input" id="edit-place2-desc" rows="3" name="place-desc"></textarea>
          </label>
        </div>
        <div class="card-footer">
          <button class="btn edit-place" type="button">Edit</button>
          <button class="btn" type="button" id="cancel-edit-${placeId}">Cancel</button>
        </div>
      </form>`;
    };

    $placeID.empty();
    $placeID.append(() => renderEditPlaceForm($placeIDString));

    // todo: make this work lol
    const revertChanges = function(event) {
      $placeID.empty();
      $placeID.append($copyBeforeEdit);
    };

    // click handler for cancel edit
    $(`#cancel-edit-${$placeIDString}`).click(revertChanges);
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
    // L.marker([49.280571, -123.11378])
    //   .bindPopup("Hopefully details here")
    //   .addTo(myMap);
    // L.marker([49.282656, -123.126912])
    //   .bindPopup("Hopefully details here")
    //   .addTo(myMap);
    // L.marker([49.285944, -123.134379])
    //   .bindPopup("Hopefully details here")
    //   .addTo(myMap);
  };
  // renderSingleMap();

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

  /* Create Map Form Submit */
  $("#createMapForm").submit(function(e) {
    e.preventDefault();
    if (!createMap) {
      return false;
    } else {
      const query = $(this).serialize();
      const center = createMap.getCenter();
      const formValues = { ...center };
      console.log("formValues to be sent", formValues, query);
      return formValues;
    }
  });

  const renderPopupDetails = function(details) {
    // param: details is an object { img, name, detail }
    const $placeImg = $("<img>").attr({ src: "https://picsum.photos/300/150" });
    const $placeName = $("<p>").text("[Cool Place Name]");
    const $placeDescription = $("<p>").text("[Cool Place Description]");
    const $place = $("<div>");

    $place.append($placeImg, $placeName, $placeDescription);
    return $place.prop("outerHTML");
  };

  const renderPopupForm = function() {
    return `
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
      `;
  };

  /* Create Point Submit Function */
  const addPointOnMap = function({ query, lat, lng }) {
    console.log("hellooooooo", lat, lng, query);
    // todo: write a POST request
    // add the marker
    const marker = L.marker([lat, lng]).addTo(createMap);
    // bind the popup to the marker
    marker.bindPopup(renderPopupDetails).openPopup();
    // close the popup form
    createMap.closePopup();
  };

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
      .setContent(renderPopupForm)
      .openOn(createMap);

    // submit handler for the form
    if ($("#addPlace")) {
      console.log("popup is alive!");
      $("#addPlace").submit(function(event) {
        event.preventDefault();
        const query = $(this).serialize();
        addPointOnMap({ query, lat, lng });
      });
    }
  };

  createMap.on("click touchstart", onMapClick);

  $.ajax({
    method: "GET",
    url:
      "https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-123.117,49.2816,14.3/300x200?access_token=pk.eyJ1IjoidGhlbGl0dGxlYmxhY2tzbWl0aCIsImEiOiJjazZkeHZmcTcwMnV1M2tvZHNpb3VidzZpIn0.STnRpYTjWHNdD1n1Ew6u6g"
  }).then(data => console.log("what is this", data));
});
