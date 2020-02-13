$(() => {
  /* Leaflet: View Map With Points (on single-map.ejs) */

  const renderSingleMap = function() {
    const { mapDetails } = $("#single-map").data();
    // render map
    if (mapDetails) {
      const { points } = $("#points-display").data();
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
          $("html, body").animate({ scrollTop: $("#single-map").offset().top - 50 }, 300, "linear");
          // open popup
          pointMarker.openPopup();
        });

        $(".delete-place-btn").on("click", function(e) {
          const { pointId: pointID } = $(this).data();
          const $parent = $(this)
            .parent()
            .parent();
          const { map } = $parent;
          $.ajax({ method: "POST", url: `/api/points/${pointID}/delete` }).then(data => {
            if (data.rowCount === 1) {
              // remove marker
              myMap.removeLayer(markerRef[pointID]);
              // remove element
              $parent.remove();
            }
          });
        });
      }
    }
  };

  renderSingleMap();
});
