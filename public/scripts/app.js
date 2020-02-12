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
});
