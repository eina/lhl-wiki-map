/* eslint-disable no-undef */
/**
 * Renders HTML element to be used for Leaflet's bindPopup method
 * @param {object} details
 */
const renderPopupDetails = function({ id, desc, title, imgURL }) {
  // param: details is an object { img, name, detail }
  const $placeImg = $("<img>")
    .addClass("img-responsive")
    .attr({ src: imgURL });
  const $placeName = $("<p>").text(title);
  const $placeDescription = $("<p>").text(desc);
  const $place = $("<div>").addClass("map-marker-details");

  $place.append($placeImg, $placeName, $placeDescription);
  return $place.prop("outerHTML");
};

$(() => {
  /* Log In Modal Functionalities */
  const modalControl = function() {
    $("#modal-login").toggleClass("active");
  };
  // toggle modal open and close
  $("#btn-login").click(modalControl);
  $("#modal-close").click(modalControl);

  /* Favorite A Map */
  $(".btn-heart").click(function() {
    const { user, map, faved } = $(this).data();
    let $numFavs = $(this).prev(".map-faves");
    if (!faved) {
      $.ajax({ method: "POST", url: `/api/favs/u/${user}/m/${map}` }).then(data => {
        if (data.rowCount) {
          const current = Number($numFavs.text());
          $numFavs.text(current + 1);
          $(this)
            .data({ faved: true })
            .toggleClass("faved-map");
        }
      });
    } else {
      $.ajax({
        method: "DELETE",
        url: `/api/favs/u/${user}/m/${map}`
      }).then(data => {
        if (data.rowCount) {
          const current = Number($numFavs.text());
          $numFavs.text(current - 1);
          $(this)
            .data({ faved: false })
            .toggleClass("faved-map");
        }
      });
    }
  });

  /**
   * Delete Map
   */

  $("#delete-map").on("click", function() {
    const { map: mapID, user: userID } = $(this).data();
    $.ajax({
      method: "POST",
      url: `/api/maps/${mapID}/delete`,
      data: userID
    }).then(data => {
      window.location.replace(window.location.origin);
      return;
    });
  });
});
