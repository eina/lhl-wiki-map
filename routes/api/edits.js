const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/u/:userID", (req, res) => {
    let queryParams = [];
    let queryString = `
    SELECT
      edits.edited_at,
      maps.*
    FROM
      users
      JOIN edits ON users.id = u_id
      JOIN maps ON maps.id = edits.map_id
    `;

    queryParams.push(req.params.userID);
    queryString += `WHERE users.id = $${queryParams.length} `;

    queryString += `
    ORDER BY
      edits.edited_at DESC;
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
