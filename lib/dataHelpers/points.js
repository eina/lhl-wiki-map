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
};
