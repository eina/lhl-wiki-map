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
    console.log("yo did a change happen");
    // remove content inside
    $userContainer.empty();
    if ($selectVal === "my-maps") {
      $userContainer.append(`    <h2 class="grid-header">My Maps</h2>

    <div class="card-grid">
      <div class="card s-rounded">
        <div class="card-image">
          <img class="img-responsive" src="https://picsum.photos/800/500" />
        </div>
        <div class="card-header">
          <div class="card-title h5">Map Title</div>
          <p>999 &hearts;</p>
        </div>
      </div>
    </div>`);
    }
    if ($selectVal === "my-faves") {
      $userContainer.append(`    <h2 class="grid-header">My Favourite Maps</h2>

    <div class="card-grid">
      <div class="card s-rounded">
        <div class="card-image">
          <img class="img-responsive" src="https://picsum.photos/800/500" />
        </div>
        <div class="card-header">
          <div>
            <div class="card-title h5">Map Title</div>
            <p class="card-subtitle">by Some Other User</p>
          </div>

          <p>999 &hearts;</p>
        </div>
      </div>
    </div>`);
    }

    if ($selectVal === "my-activity") {
      $userContainer.append(`    <h2 class="grid-header">Activity</h2>
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>Date</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        <tr class="active">
          <td>January 24, 2020</td>
          <td>Edited <a href="#">[Map Name]</a></td>
        </tr>
      </tbody>
    </table>`);
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
