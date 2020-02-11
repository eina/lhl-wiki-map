const express = require(`express`);
const router = express.Router();

module.exports = db => {
  // Get all users
  router.get(`/all`, (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json(users);
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });

  // Get the logged-in user based on data in cookie
  router.get(`/current`, (req, res) => {
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
          res.status(500).json({ error: err.message });
        });
    } else {
      return res.status(401).json(`401: y u no login`);
    }
  });

  // Get user given a user email address
  router.post(`/login`, (req, res) => {
    let queryParams = [];
    let queryString = `SELECT * FROM users `;

    queryParams.push(req.body.userEmail);
    queryString += `WHERE users.email = $${queryParams.length};`;

    return db
      .query(queryString, queryParams)
      .then(data => {
        const result = data.rows[0];
        res.cookie("user", data.rows[0].email);
        res.render("index", { user: result });
        // res.cookie("user", data.rows[0].email).json(result);
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });

  // Get user given a user ID
  router.get(`/id/:userID`, (req, res) => {
    let queryParams = [];
    let queryString = `SELECT * FROM users `;

    queryParams.push(req.params.userID);
    queryString += `WHERE users.id = $${queryParams.length};`;

    db.query(queryString, queryParams)
      .then(data => {
        res.json(data.rows[0]);
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
