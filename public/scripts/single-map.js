$(() => {
  /* Leaflet Shared Map? */
  /* Leaflet: View Map With Points (on single-map.ejs) */

  const renderSingleMap = function() {
    const { mapDetails } = $("#single-map").data();
    // render map
    const mapLatLng = L.latLng(mapDetails.center_lat, mapDetails.center_lng);
    console.log("hello?", mapLatLng);
    const myMap = L.map("single-map").setView(mapLatLng, 15);
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

  renderSingleMap();
  // $.ajax({ method: "GET", url: "/maps/2" }).then(pageHTML => {
  //   if (pageHTML) {
  //     console.log("hell from the ajax request");
  //   }
  // });
});
