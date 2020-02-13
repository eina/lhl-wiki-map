const express = require('express');
const router  = express.Router();
const { deleteMap, getMaps } = require("../../lib/dataHelpers/maps");

module.exports = (db) => {
  router.get("/all", (req, res) => {
    getMaps(db)
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

  router.get("/:mapID/points", (req, res) => {
    //TODO Write this
  });

  router.delete("/:mapID", (req, res) => {
    deleteMap(db, {
      mapID: req.params.mapID,
    })
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
