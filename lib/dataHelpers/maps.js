const { postPoint } = require("./points");

module.exports = {
  getMaps: db => {
    let queryParams = [];
    let queryString = `
    SELECT
      maps.*,
      users.fullname AS owner_name,
      count(favorites.*) AS fav_count
    FROM
      maps
      JOIN users ON users.id = u_id
      JOIN favorites ON maps.id = map_id
    GROUP BY
      maps.id,
      users.fullname
    ORDER BY
      fav_count DESC,
      maps.id ASC;
    `;

    return db
      .query(queryString, queryParams)
      .then(data => data.rows)
      .catch(err => {
        return { status: 500, error: err.message };
      });
  },

  getMapByID: (db, { mapID }) => {
    let queryParams = [];
    let queryString = `SELECT maps.*, count(favorites.*) AS fav_count FROM maps JOIN favorites ON maps.id = map_id `;

    queryParams.push(mapID);
    queryString += `WHERE maps.id = $${queryParams.length} `;

    queryString += `
    GROUP BY
      maps.id;
    `;

    return db
      .query(queryString, queryParams)
      .then(data => data.rows[0])
      .catch(err => {
        return { status: 500, error: err.message };
      });
  },

  // cLat and cLng is center lat and long
  // current time should be in '2028-10-19 23:59'
  // points is an Array with:
  // title, detail, imageURL, lat, lng
  postMap: (db, { userID, mapTitle, creationTime, centerLat, centerLng, points }) => {
    let queryParams = [];
    let queryString = `INSERT INTO maps (u_id, title, created_at, center_lat, center_lng) `;

    queryParams.push(userID, mapTitle, creationTime, centerLat, centerLng);
    queryString += `VALUES ($1, $2, $3, $4, $5) RETURNING id;`;

    let resultsJSON = [];
    return db
      .query(queryString, queryParams)
      .then(data => {
        resultsJSON.push(data);
        return data.rows[0].id;
      })
      .then(mapID => {
        if (points && Array.isArray(points)) {
          points.forEach(element => {
            element.mapID = mapID;
            postPoint(db, element)
              .then(data => {
                resultsJSON.push(data);
              })
              .catch(err => {
                return { status: 500, error: err.message };
              });
          });
        }
      })
      .then(() => {
        return resultsJSON;
      })
      .catch(err => {
        return { status: 500, error: err.message };
      });
  }
};
