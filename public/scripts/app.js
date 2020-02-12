/* eslint-disable no-undef */
$(() => {
  /* Log In Modal Functionalities */
  const modalControl = function() {
    $("#modal-login").toggleClass("active");
  };
  // toggle modal open and close
  $("#btn-login").click(modalControl);
  $("#modal-close").click(modalControl);

  /* Favourite A Map */
  $(".btn-heart").click(function() {
    const { user, map, faved } = $(this).data();
    let $numFavs = $(this).prev(".map-faves");

    if (!faved) {
      $.ajax({ method: "POST", url: `/api/favs/u/${user}/m/${map}` }).then(data => {
        if (data.rowCount) {
          const current = Number($numFavs.text());
          $numFavs.text(current + 1);
        }
      });
    } else {
      console.log("lol you tried to fave again");
      // $.ajax({
      //   method: "DELETE",
      //   url: `/api/favs/u/${user}/m/${map}`
      // }).then(data => {
      //   if (data.rowCount) {
      //     const current = Number($numFavs.text());
      //     $numFavs.text(current - 1);
      //   }
      // });
    }
  });

  /* Edit Place Details */
  // const editPlaceBtn = $(".edit-place");

  // editPlaceBtn.click(function(event) {
  //   const $placeID = $(this)
  //     .parent()
  //     .parent();
  //   const $placeIDString = $placeID.attr("id");
  //   const $copyBeforeEdit = $placeID.clone();
  //   // todo: need the details of this place to be populated!

  //   const renderEditPlaceForm = placeId => {
  //     return `<form id="edit-${placeId}">
  //       <div class="card-body">
  //         <label class="form-group">
  //           <span class="form-label">Name</span>
  //           <input type="text" class="form-input" id="edit-place2-name" name="place-name" />
  //         </label>
  //         <label class="form-group">
  //           <span class="form-label">Image URL</span>
  //           <input type="text" class="form-input" id="edit-place2-img" name="place-img" />
  //         </label>
  //         <label class="form-group">
  //           <span class="form-label">Description</span>
  //           <textarea class="form-input" id="edit-place2-desc" rows="3" name="place-desc"></textarea>
  //         </label>
  //       </div>
  //       <div class="card-footer">
  //         <button class="btn edit-place" type="button">Edit</button>
  //         <button class="btn" type="button" id="cancel-edit-${placeId}">Cancel</button>
  //       </div>
  //     </form>`;
  //   };

  //   $placeID.empty();
  //   $placeID.append(() => renderEditPlaceForm($placeIDString));

  //   // todo: make this work lol
  //   const revertChanges = function(event) {
  //     $placeID.empty();
  //     $placeID.append($copyBeforeEdit);
  //   };

  //   // click handler for cancel edit
  //   $(`#cancel-edit-${$placeIDString}`).click(revertChanges);
  // });

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

  const tempPointsArray = [];

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
          <input type="text" class="form-input" id="place-img" name="place-img" />
        </div>
        <div class="form-group">
          <label for="place-desc" class="form-label">Description</label>
          <textarea class="form-input" name="place-desc" id="place-desc" placeholder="Textarea" rows="3"></textarea>
        </div>
      <button type="submit" class="btn btn-primary">Add</button>
      </form>
      `;
  };

  /* Create Point Submit Function */
  const addPointOnMap = function({ query, lat, lng }) {
    tempPointsArray.push({ lat, lng, query });
    console.log("hellooooooo", tempPointsArray);
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
});
