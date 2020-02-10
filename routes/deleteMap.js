const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  // Delete a map by ID
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

  return router;
};
