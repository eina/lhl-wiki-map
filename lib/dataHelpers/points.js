module.exports = {
  getPointsByMapID: (db, { id }) => {
  },

  postPoint: (db, {mapID, title, detail, imageURL, lat, lng}) => {
    let queryParams = [];
    let queryString = `INSERT INTO points (map_id, title, detail, image_url, lat, lng) `;

    queryParams.push(mapID, title, detail, imageURL, lat, lng);
    queryString += `VALUES ($1, $2, $3, $4, $5, $6);`;

    return db.query(queryString, queryParams)
      .then(data => data)
      .catch(err => {
        return { status: 500, error: err.message };
      });
  },


  editPoint: (db, {pointID, pointData}) => {
    let queryParams = [];
    let queryString = `UPDATE points
    `;

    queryParams.push(pointData.mapID, pointData.title, pointData.detail, pointData.imageURL, pointData.lat, pointData.lng);
    queryString += `SET
      map_id = $1,
      title = $2,
      detail = $3,
      image_url = $4,
      lat = $5,
      lng = $6 `;

    queryParams.push(pointID);
    queryString += `WHERE id = $${queryParams.length} RETURNING *;`;

    return db.query(queryString, queryParams)
      .then(data => data)
      .catch(err => {
        return { status: 500, error: err.message };
      });
  }
};
