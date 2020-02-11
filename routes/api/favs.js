const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  // Delete a Fav by ID
  router.delete("/:favID", (req, res) => {
    let queryParams = [];
    let queryString = `DELETE FROM favorites `;

    queryParams.push(req.params.favID);
    queryString += `WHERE favorites.id = $${queryParams.length};`;

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

  // Create a Fav
  router.put("/u/:userID/m/:mapID", (req, res) => {
    let queryParams = [];
    let queryString = `INSERT INTO favorites (u_id, map_id) `;

    queryParams.push(req.params.userID);
    queryParams.push(req.params.mapID);
    queryString += `VALUES ($1, $2);`;

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

  return router;
};
