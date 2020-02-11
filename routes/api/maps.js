const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  // Get all maps
  router.get("/all", (req, res) => {
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

    db.query(queryString, queryParams)
      .then(data => {
        const maps = data.rows;
        res.json(maps);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Get a map with map ID
  router.get("/id/:mapID", (req, res) => {
    let queryParams = [];
    let queryString = `SELECT * FROM maps `;

    queryParams.push(req.params.mapID);
    queryString += `WHERE maps.id = $${queryParams.length};`;

    db.query(queryString, queryParams)
      .then(data => {

        res.json(data.rows[0]);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Delete a map by map ID
  router.delete("/:mapID", (req, res) => {
    // res.json(`Not yet implemented lol`);
    let queryParams = [];
    let queryString = `DELETE FROM maps `;

    queryParams.push(req.params.mapID);
    queryString += `WHERE maps.id = $${queryParams.length};`;

    db.query(queryString, queryParams)
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Get user's maps given a user ID.
  router.get("/u/:userID", (req, res) => {
    let queryParams = [];
    let queryString = `
    SELECT
      maps.*,
      users.fullname AS owner_name,
      count(favorites.*) AS fav_count
    FROM
      maps
      JOIN users ON users.id = u_id
      JOIN favorites ON maps.id = map_id `;

    queryParams.push(req.params.userID);
    queryString += `WHERE users.id = $${queryParams.length} `;

    queryString += `
    GROUP BY
      maps.id,
      users.fullname
    ORDER BY
      fav_count DESC,
      maps.id ASC;
    `;

    db.query(queryString, queryParams)
      .then(data => {
        const maps = data.rows;
        res.json(maps);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Get user's maps given a user ID.
  router.get("/u/:userID/favs", (req, res) => {
    let queryParams = [];
    let queryString = `
    SELECT
      users.id,
      maps.*
    FROM
      users
      JOIN favorites ON users.id = u_id
      JOIN maps ON maps.id = favorites.map_id
    `;

    queryParams.push(req.params.userID);
    queryString += `WHERE users.id = $${queryParams.length};`;

    db.query(queryString, queryParams)
      .then(data => {
        const maps = data.rows;
        res.json(maps);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};
