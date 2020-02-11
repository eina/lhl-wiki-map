const express = require(`express`);
const router  = express.Router();

module.exports = (db) => {
  router.get(`/all`, (req, res) => {
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
          res
            .status(500)
            .json({ error: err.message });
        });
    } else {
      return res.status(401).json(`401: y u no login`);
    }
  });

  router.get(`/email/:userEmail`, (req, res) => {
    let queryParams = [];
    let queryString = `SELECT * FROM users `;

    queryParams.push(req.params.userEmail);
    queryString += `WHERE users.email ILIKE $${queryParams.length};`;

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

  router.get(`/:userID`, (req, res) => {
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

  router.get("/:userID/maps", (req, res) => {
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

  router.get("/:userID/favs", (req, res) => {
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

  router.get("/:userID/edits", (req, res) => {
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
