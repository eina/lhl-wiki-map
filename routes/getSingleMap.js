const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  // Get a map by ID
  router.get("/:mapID", (req, res) => {
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

  return router;
};
