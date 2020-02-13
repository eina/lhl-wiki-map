$(() => {
  /* Leaflet: View Map With Points (on single-map.ejs) */

  /* Edit Place Details */
  const {
    mapDetails: { mapID, lat: mapLat, lng: mapLng }
  } = $("#leaflet-map").data();
  const $editPlaceBtn = $(".edit-place-btn");
  const $deletePlaceBtn = $(".delete-place-btn");

  const renderEditPlaceForm = function(placeID) {
    return `<form id="edit-${placeID}">
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
          <button class="btn" type="button" id="cancel-edit-${placeID}">Cancel</button>
        </div>
      </form>`;
  };

  const editPlace = function() {
    const { pointId: pointID } = $(this).data();
    // find the parent
    const $parent = $(`[data-map=${mapID}][data-point=${pointID}]`);
    // clone the element in case user cancels their edit
    const $copyBeforeEdit = $parent.clone();

    $parent.append(renderEditPlaceForm(pointID));
  };

  $editPlaceBtn.on("click", editPlace);

  // editPlaceBtn.click(function(event) {
  //   const $placeID = $(this)
  //     .parent()
  //     .parent();
  //   const $placeIDString = $placeID.attr("id");
  //   const $copyBeforeEdit = $placeID.clone();
  //   // todo: need the details of this place to be populated!

  // const renderEditPlaceForm = placeId => {
  //   return `<form id="edit-${placeId}">
  //     <div class="card-body">
  //       <label class="form-group">
  //         <span class="form-label">Name</span>
  //         <input type="text" class="form-input" id="edit-place2-name" name="place-name" />
  //       </label>
  //       <label class="form-group">
  //         <span class="form-label">Image URL</span>
  //         <input type="text" class="form-input" id="edit-place2-img" name="place-img" />
  //       </label>
  //       <label class="form-group">
  //         <span class="form-label">Description</span>
  //         <textarea class="form-input" id="edit-place2-desc" rows="3" name="place-desc"></textarea>
  //       </label>
  //     </div>
  //     <div class="card-footer">
  //       <button class="btn edit-place" type="button">Edit</button>
  //       <button class="btn" type="button" id="cancel-edit-${placeId}">Cancel</button>
  //     </div>
  //   </form>`;
  // };

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

  const renderSingleMap = function({ mapLat, mapLng }) {
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
      const myMap = L.map("leaflet-map").setView(mapLatLng, 14);
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

      if (points && points.length) {
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

  renderSingleMap({ mapLat, mapLng });
});
