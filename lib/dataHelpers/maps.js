const { postPoint, getPointsByMapID } = require("./points");
const { deleteFav } = require("./favs");

module.exports = {

  /**
   * Get a map by mapID. Also returns all points on the map.
   */
  getMapByID: (db, { mapID }) => {
    let queryParams = [];
    let queryString = `SELECT maps.*, count(favorites.*) AS fav_count FROM maps FULL JOIN favorites ON maps.id = map_id `;

    queryParams.push(mapID);
    queryString += `WHERE maps.id = $${queryParams.length} `;

    queryString += `
    GROUP BY
      maps.id;
    `;



    let mapData = {};
    return db
      .query(queryString, queryParams)
      .then(data => {
        console.log(data);

        mapData = data.rows[0];

        return getPointsByMapID(db, { mapID });
      }).then(pointData => {
        mapData['points'] = pointData;
        return mapData;
      })
      .catch(err => {
        return { status: 500, error: err.message };
      });
  },

  /**
   * Grabs all maps, sorted by number of favorites desc, then id asc.
   */
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
      FULL JOIN favorites ON maps.id = map_id
    WHERE
      maps.existence = TRUE
    GROUP BY
      maps.id,
      users.fullname
    ORDER BY
      maps.id ASC;
    `;

    return db
      .query(queryString, queryParams)
      .then(data => data.rows)
      .catch(err => {
        return { status: 500, error: err.message };
      });
  },

  getMapsOwnedByUser: (db, { userID }) => {
    let queryParams = [];
    let queryString = `
    SELECT
      maps.*,
      users.fullname AS owner_name,
      count(favorites.*) AS fav_count
    FROM
      maps
      JOIN users ON users.id = u_id
      FULL JOIN favorites ON maps.id = map_id `;

    queryParams.push(userID);
    queryString += `WHERE users.id = $${queryParams.length} `;

    queryString += `
    GROUP BY
      maps.id,
      users.fullname
    ORDER BY
      fav_count DESC,
      maps.id ASC;
    `;

    return db
      .query(queryString, queryParams)
      .then(data => {
        return data.rows;
      })
      .catch(err => {
        return { status: 500, error: err.message };
      });
  },

  /**
   * Get the map ids of what user favorited
   */
  getMapsFavedByUser: (db, { userID }) => {
    let queryParams = [];
    let queryString = `
    SELECT
      maps.*,
      users.fullname AS owner_name,
      count(favorites.*) AS fav_count
    FROM
      maps
      JOIN users ON users.id = u_id
      FULL JOIN favorites ON maps.id = map_id
    WHERE
      maps.existence = TRUE `;

    queryParams.push(userID);
    queryString += `AND favorites.u_id = $${queryParams.length} `;

    queryString += `
    GROUP BY
      maps.id,
      users.fullname
    ORDER BY
      maps.id ASC;
    `;

    return db
      .query(queryString, queryParams)
      .then(data => data.rows)
      .catch(err => {
        return { status: 500, error: err.message };
      });
  },

  getMapsEditedByUser: (db, { userID }) => {
    let queryParams = [];
    let queryString = `
      SELECT
        edits.edited_at,
        maps.id as map_id,
        maps.title
      FROM
        users
        JOIN edits ON users.id = u_id
        FULL JOIN maps ON maps.id = edits.map_id
      `;

    queryParams.push(userID);
    queryString += `WHERE users.id = $${queryParams.length} `;

    queryString += `
      ORDER BY
        edits.edited_at DESC;
      `;

    return db
      .query(queryString, queryParams)
      .then(data => {
        return data.rows;
      })
      .catch(err => {
        return { status: 500, error: err.message };
      });
  },

  deleteMap: (db, { mapID }) => {
    let queryParams = [];
    let queryString = `UPDATE maps `;

    queryString += `SET existence = FALSE `;

    queryParams.push(mapID);
    queryString += `WHERE id = $${queryParams.length} RETURNING *;`;

    let returnData = {};
    return db.query(queryString, queryParams)
      .then(data => {
        returnData.dexistMap = data;
        return deleteFav(db, { mapID });
      }).then(data => {
        returnData.deleteFavs = data;
        return returnData;
      })
      .catch(err => {
        return { status: 500, error: err.message };
      });
  },

  /**
   * Create a new map
   * note: cLat and cLng is center lat and long
   * note: current time should be in '2028-10-19 23:59'
   */
  createNewMap: (db, { userID, mapTitle, creationTime, centerLat, centerLng, points }) => {
    let queryParams = [];
    let queryString = `INSERT INTO maps (u_id, title, created_at, center_lat, center_lng) `;

    queryParams.push(userID, mapTitle, creationTime, centerLat, centerLng);
    queryString += `VALUES ($1, $2, $3, $4, $5) RETURNING *;`;

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
  },

  /**
   * Edit a map.
   * But here, it's only changing the basic stuff.
   */
  updateMap: (db, { mapID, mapData }) => {
    let queryParams = [];
    let queryString = `UPDATE maps `;

    queryParams.push(
      mapData.mapTitle,
      mapData.centerLat,
      mapData.centerLng,
    );
    queryString += `SET
      title = $1,
      center_lat = $2,
      center_lng = $3 `;

    queryParams.push(mapID);
    queryString += `WHERE id = $${queryParams.length} RETURNING *;`;

    return db
      .query(queryString, queryParams)
      .then(data => data)
      .catch(err => {
        return { status: 500, error: err.message };
      });
  },
};
