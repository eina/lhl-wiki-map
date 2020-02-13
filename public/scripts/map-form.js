$(() => {
  /**
   * Leaflet: Create Map (on map-form.ejs)
   * renderPopupDetails: imported from app.js as a global variable
   */

  const tempPointsArray = [];

  const renderCreateMap = function() {
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
    return createMap;
  };

  /**
   * onSubmit handler for #createMapForm
   * @param {object} e submit event object
   */
  const submitCreateMapForm = function(event, mapObj) {
    event.preventDefault();
    if (!mapObj) {
      return false;
    } else {
      const query = $(this).serialize();
      const center = mapObj.getCenter();
      const formValues = { ...center };
      console.log("formValues to be sent", formValues, query);
      // return formValues;

      $.ajax({ method: "POST", url: "/maps/new", data: { formValues, query } });
    }
  };

  /**
   * Adds marker on Leaflet map
   * @param {object} { map: <Leaflet object>, query: serialized string, lat, lng}
   */
  const addPointOnMap = function({ map, coords, formVals }) {
    // add the marker
    const marker = L.marker(coords).addTo(map);
    // bind the popup to the marker
    // needs details
    marker.bindPopup(renderPopupDetails({ ...formVals })).openPopup();
    // close the popup form
    mapForm.closePopup();
  };

  /**
   * Renders single map card on /(index)
   * @param {object} mapDetails object with: center_lat, center_lng, title, owner_name, id, numFavs
   */
  const renderPlaceCard = function({ title, desc, imgURL }) {
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
    $cardHeaderContainer.append($placeTitle);

    const $cardBodyContainer = $("<div>").addClass("card-body");
    const $cardBodyText = $("<p>").text(desc);
    $cardBodyContainer.append($cardBodyText);

    const $cardFooterContainer = $("<div>").addClass("card-body");
    const $deleteButton = $("<button>")
      .addClass("btn delete-place-btn")
      .text("Delete");
    $cardFooterContainer.append($deleteButton);

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
      .openOn(mapForm);

    // submit handler for the form
    if ($("#addPlace")) {
      $("#addPlace").submit(function(event) {
        event.preventDefault();
        const placeName = $(this)
          .find("#place-name")
          .val();
        const placeDesc = $(this)
          .find("#place-desc")
          .val();
        const placeImg = $(this)
          .find("#place-img")
          .val();
        if (placeName && placeDesc) {
          const query = $(this).serialize();
          // push this to array to be sent to map
          tempPointsArray.push({ query, lat, lng, title: placeName });
          // show marker on map with details
          addPointOnMap({
            map: mapForm,
            coords: L.latLng(lat, lng),
            formVals: { title: placeName, imgURL: placeImg, desc: placeDesc }
          });
          // show on my places grid
          $("#user-points").prepend(
            renderPlaceCard({ title: placeName, imgURL: placeImg, desc: placeDesc })
          );
          console.log("tempPointsArray????", tempPointsArray);
        } else {
          console.log("submit something you fool!");
        }
      });
    }
  };

  /* instantiate leaflet map */
  const mapForm = renderCreateMap();
  const $deletePlace = $(".delete-place-btn");

  /* Create Map Form Submit */
  $("#createMapForm").submit(e => submitCreateMapForm(e, mapForm));

  /* click handler for leaflet map */
  mapForm.on("click touchstart", onMapClick);

  const removeObj = (array, placeName) => {
    let result = [];

    array.forEach(obj => {
      if (obj.title !== placeName) {
        result.push(obj);
      }
    });

    return result;
  };

  $("#user-points").on("click", ".delete-place-btn", function(e) {
    // select the parent so you can remove it
    const $cardParent = $(this).parents(".card");
    const cardTitle = $cardParent.find(".card-title").text();
    // find in tempArray and delete
    removeObj(tempPointsArray, cardTitle);
    // delete from DOM
    $cardParent.remove();
  });

  console.log($deletePlace);
});
