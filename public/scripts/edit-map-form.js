/* eslint-disable no-undef */
$(() => {
  /* Leaflet: View Map With Points (on single-map.ejs) */

  /* Edit Place Details */
  const {
    mapDetails: { mapID, lat: mapLat, lng: mapLng }
  } = $("#leaflet-map").data();
  const markerRef = [];
  const myMap = L.map("leaflet-map");

  const renderFormGroup = function(formValues, placeID) {
    const $container = $("<label>").addClass("form-group");

    Object.keys(formValues).forEach(fieldName => {
      const fieldVal = formValues[fieldName];
      const idString = `edit-place${placeID}-name`;
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
    const $parent = $(`[data-map=${mapID}][data-point=${pointID}]`);
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
  };

  const renderSingleMap = function({ map, mapLat, mapLng }) {
    const $mapTitle = $("#map-title");
    const { value: titleValue } = $mapTitle.data();

    // Set title value
    $mapTitle.val(titleValue);

    /**
     * Render Map
     */
    if ((mapLat, mapLng)) {
      const { points } = $("#points-display").data();
      const mapLatLng = L.latLng(mapLat, mapLng);
      map.setView(mapLatLng, 14);
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
      yvrMap.addTo(map);

      if (points && points.length) {
        points.forEach(({ lat, lng, id, detail: desc, title, image_url: imgURL }) => {
          const pointLatLng = L.latLng(lat, lng);
          // render markers
          markerRef[id] = L.marker(pointLatLng)
            .bindPopup(renderPopupDetails({ id, desc, title, imgURL }))
            .addTo(map);
        });

        $(".view-marker-btn").click(function() {
          const { pointId } = $(this).data();
          const pointMarker = markerRef[pointId];
          // scroll to map div
          $("html, body").animate(
            { scrollTop: $("#leaflet-map").offset().top - 50 },
            300,
            "linear"
          );
          // open popup
          pointMarker.openPopup();
        });
      }
    }
  };

  renderSingleMap({ map: myMap, mapLat, mapLng });

  // click handler for edit button
  $(".card").on("click", ".edit-place-btn", editPlace);

  // click handler for edit button
  $(".card").on("click", ".delete-place-btn", function(e) {
    const { pointId: pointID } = $(this).data();
    const $parent = $(`[data-map=${mapID}][data-point=${pointID}]`);
    // test
    $.ajax({ method: "POST", url: `/api/points/${pointID}/delete` }).then(data => {
      if (data.rowCount === 1) {
        // remove marker
        myMap.removeLayer(markerRef[pointID]);
        // remove element
        $parent.remove();
      }
    });
  });
});
