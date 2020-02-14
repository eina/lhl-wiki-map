/* eslint-disable no-undef */
$(() => {
  /* Leaflet: View Map With Points (on single-map.ejs) */
  const markerRef = [];
  const singleMap = L.map("single-map");
  const {
    mapDetails: { mapID, userID },
    user
  } = $("#single-map").data();
  console.log(`${userID} in single-map.js`);

  /**
   * Renders single map card on /(index)
   * @param {object} mapDetails object with: center_lat, center_lng, title, owner_name, id, numFavs
   */
  const renderPlaceCard = function({ title, desc, imgURL, point, map, details }) {
    const $cardContainer = $("<article>").addClass("card s-rounded");
    const $cardImgContainer = $("<div>").addClass("card-image");
    const $cardImg = $("<img>").attr({
      class: "img-responsive",
      src: imgURL
    });
    $cardImgContainer.append($cardImg);

    const $cardHeaderContainer = $("<div>").addClass("card-header");
    const $placeTitle = $("<h3>")
      .addClass("card-title")
      .text(title);

    const $cardBodyContainer = $("<div>").addClass("card-body");
    const $cardBodyText = $("<p>").text(desc);

    const $cardFooterContainer = $("<div>").addClass("card-footer point-btn-container text-center");
    const $deleteButton = $("<button>")
      .addClass("btn btn-primary delete-place-btn")
      .text("Delete");
    const $editButton = $("<button>")
      .addClass("btn btn-primary edit-place-btn")
      .text("Edit");
    const $viewMapButton = $("<button>")
      .addClass("btn btn-primary view-marker-btn")
      .text("View on Map");

    if (point && map && details) {
      $cardContainer.attr({ data: { point, map, details: JSON.stringify(details) } });
      $deleteButton.attr({ "data-point-id": point });
      $editButton.attr({ "data-point-id": point });
      $viewMapButton.attr({ "data-point-id": point });
    }

    $cardHeaderContainer.append($placeTitle);
    $cardBodyContainer.append($cardBodyText);
    $cardFooterContainer.append($viewMapButton, $editButton, $deleteButton);

    $cardContainer.append(
      $cardImgContainer,
      $cardHeaderContainer,
      $cardBodyContainer,
      $cardFooterContainer
    );
    return $cardContainer;
  };

  /**
   * Render form that shows on map click to add a point
   */
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

  /**
   * onClick handler when clicking on map form
   * -> opens addPointOnMap popup form
   * @param {object} e Leaflet on map click handler
   */
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
      .openOn(singleMap);

    // submit handler for the form
    if ($("#addPlace")) {
      $("#addPlace").submit(function(event) {
        const query = $(this).serialize();
        event.preventDefault();
        const placeName = $(this)
          .find("#place-name")
          .val();
        const placeDesc = $(this)
          .find("#place-desc")
          .val();
        if (placeName && placeDesc) {
          // show marker on map with details
          $.ajax({ method: "POST", url: `/points/new?${query}`, data: { lat, lng, mapID, userID } }).then(
            data => {
              const {
                detail: desc,
                id: point,
                image_url: imgURL,
                lat,
                lng,
                map_id: map,
                title,
              } = data;
              addPointOnMap({
                map: singleMap,
                coords: L.latLng(lat, lng),
                formVals: { title, imgURL, desc }
              });
              // show on my places grid
              $("#user-points").append(
                renderPlaceCard({ title, imgURL, desc, point, map, details: JSON.stringify(data) })
              );
            }
          );
        } else {
          console.log("submit something you fool!");
        }
      });
    }
  };

  /**
   * Adds marker on Leaflet map
   * @param {object} { map: <Leaflet object>, query: serialized string, lat, lng}
   */
  const addPointOnMap = function({ map, coords, formVals }) {
    // add the marker
    const marker = L.marker(coords).addTo(map);
    // set to markerRef so you can delete it
    markerRef.push(marker);
    // bind the popup to the marker
    marker.bindPopup(renderPopupDetails({ ...formVals })).openPopup();
    // close the popup form
    map.closePopup();
  };

  const renderFormGroup = function(formValues, placeID) {
    const $container = $("<label>").addClass("form-group");

    Object.keys(formValues).forEach(fieldName => {
      const fieldVal = formValues[fieldName];
      const idString = `edit-${fieldName}`;
      const $formLabel = $("<span>")
        .addClass("form-label")
        .css("text-transform", "capitalize");
      const $formInput = $(fieldName === "description" ? "<textarea>" : "<input>")
        .addClass("form-input")
        .attr({ type: "text", name: idString, id: idString });

      $formLabel.text(fieldName === "imgURL" ? "Image URL" : fieldName);
      $formInput.val(fieldVal);

      $container.append($formLabel, $formInput);
    });
    return $container;
  };

  const renderEditPlaceForm = function(placeID, formDetails) {
    const $cardBody = $("<div>").addClass("card-body");
    const $form = $("<form>").attr({ id: `edit-${placeID}` });
    const $saveEditBtn = $("<button>")
      .addClass("btn btn-primary")
      .attr({ type: "submit" })
      .text("Save");
    const $cancelEditBtn = $("<button>")
      .addClass("btn btn-danger cancel-edit-btn")
      .attr({ type: "button" })
      .text("Cancel");

    const $btnContainer = $("<div>").addClass("card-footer text-right");
    const { title: name, detail: description, image_url: imgURL } = formDetails;

    $btnContainer.append($cancelEditBtn, $saveEditBtn);
    $cardBody.append(renderFormGroup({ name, imgURL, description }, placeID));
    $form.append($cardBody, $btnContainer);

    return $form;
  };

  const editPlace = function() {
    const { pointId: pointID } = $(this).data();
    // find the parent
    const $parent = $(`[data-map=${mapID}][data-point=${pointID}]`)
      ? $(`[data-map=${mapID}][data-point=${pointID}]`)
      : this.parent().parent();
    let $copyBeforeEdit = $parent.clone();
    const { details } = $parent.data();
    // clone the element in case user cancels their edit

    // empty card and append form
    $parent.empty();
    $parent.append(renderEditPlaceForm(pointID, details));

    $parent.on("click", ".cancel-edit-btn", function() {
      $parent.empty();
      $parent.append($copyBeforeEdit[$copyBeforeEdit.length - 1]);
      $copyBeforeEdit = [];
    });

    $parent.find("form").on("submit", function(e) {
      e.preventDefault();
      const query = $(this).serialize();
      const { detail, id, image_url: imageURL, lat, lng, map_id: mapID, title } = details;
      const dataToSend = {
        mapID,
        lat,
        lng
      };
      $.ajax({ method: "POST", url: `/points/${id}/update?${query}`, data: dataToSend }).then(
        data => {
          if (data) {
            const { title, detail: desc, image_url: imgURL, id: point, map_id: map } = data;
            $parent.empty();
            $parent.append(
              renderPlaceCard({ title, desc, imgURL, point, map, details: JSON.stringify(data) })
            );
          }
        }
      );
    });
  };

  const renderSingleMap = function(map) {
    const { mapDetails } = $("#single-map").data();
    // render map
    if (mapDetails) {
      const mapLatLng = L.latLng(mapDetails.lat, mapDetails.lng);
      const myMap = map.setView(mapLatLng, 14);
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

      if ($("#points-display").data()) {
        const { points } = $("#points-display").data();

        points.forEach(({ lat, lng, id, detail: desc, title, image_url: imgURL }) => {
          const pointLatLng = L.latLng(lat, lng);
          // render markers
          markerRef[id] = L.marker(pointLatLng)
            .bindPopup(renderPopupDetails({ id, desc, title, imgURL }))
            .addTo(myMap);
        });
      }
    }
  };

  renderSingleMap(singleMap);
  // click handler for edit
  $(".card").on("click", ".edit-place-btn", editPlace);

  // click handler for delete
  $(".card").on("click", ".delete-place-btn", function(e) {
    if ($(this).data()) {
      const { pointId: pointID } = $(this).data();
      const $parent = $(this)
        .parent()
        .parent();
      $.ajax({ method: "POST", url: `/api/points/${pointID}/delete` }).then(data => {
        if (data.rowCount === 1) {
          // remove marker
          singleMap.removeLayer(markerRef[pointID]);
          // remove element
          $parent.remove();
        }
      });
    }
  });

  /* click handler for leaflet map */
  if (user || userID) {
    singleMap.on("click touchstart", onMapClick);
  }

  $(".view-marker-btn").click(function() {
    const { pointId } = $(this).data();
    const pointMarker = markerRef[pointId];
    // scroll to map div
    $("html, body").animate({ scrollTop: $("#single-map").offset().top - 50 }, 300, "linear");
    // open popup
    pointMarker.openPopup();
  });
});
