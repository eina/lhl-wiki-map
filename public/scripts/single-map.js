$(() => {
  /* Leaflet: View Map With Points (on single-map.ejs) */

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

  const editPlace = function(mapID) {
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

  const renderSingleMap = function() {
    const { mapDetails } = $("#single-map").data();
    // render map
    if (mapDetails) {
      const mapLatLng = L.latLng(mapDetails.lat, mapDetails.lng);
      const myMap = L.map("single-map").setView(mapLatLng, 14);
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
        const markerRef = [];

        points.forEach(({ lat, lng, id, detail: desc, title, image_url: imgURL }) => {
          const pointLatLng = L.latLng(lat, lng);
          // render markers
          markerRef[id] = L.marker(pointLatLng)
            .bindPopup(renderPopupDetails({ id, desc, title, imgURL }))
            .addTo(myMap);
        });

        $(".view-marker-btn").click(function() {
          const { pointId } = $(this).data();
          const pointMarker = markerRef[pointId];
          // scroll to map div
          $("html, body").animate({ scrollTop: $("#single-map").offset().top - 50 }, 300, "linear");
          // open popup
          pointMarker.openPopup();
        });

        $(".delete-place-btn").on("click", function(e) {
          // const { pointId: pointID } = $(this).data();
          // const $parent = $(this)
          //   .parent()
          //   .parent();
          // const { map } = $parent;
          // $.ajax({ method: "POST", url: `/api/points/${pointID}/delete` }).then(data => {
          //   if (data.rowCount === 1) {
          //     // remove marker
          //     myMap.removeLayer(markerRef[pointID]);
          //     // remove element
          //     $parent.remove();
          //   }
          // });
        });
      }
    }
  };

  renderSingleMap();
});
