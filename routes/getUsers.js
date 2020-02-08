const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    if (req.cookies.userID) {
      let queryParams = [];
      let queryString = `SELECT * FROM users `;

      queryParams.push(req.cookies.userID);
      queryString += `WHERE users.id = $${queryParams.length};`;

      db.query(queryString, queryParams)
        .then(data => {
          res.json(data.rows[0]);
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
    } else {
      return res.status(401).json('401: y u no login');
    }
  });

  router.get("/all", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json(users);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/:userID", (req, res) => {
    let queryParams = [];
    let queryString = `SELECT * FROM users `;

    queryParams.push(req.params.userID);
    queryString += `WHERE users.id = $${queryParams.length};`;

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
