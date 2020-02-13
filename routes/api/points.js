const express = require(`express`);
const router = express.Router();
const { deletePoint } = require("../../lib/dataHelpers/points");

module.exports = db => {
  router.post("/:pointID/delete", (req, res) => {
    deletePoint(db, {
      pointID: req.params.pointID
    })
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
