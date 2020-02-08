const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
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
  return router;
};
