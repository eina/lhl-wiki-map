const express = require(`express`);
const router = express.Router();

module.exports = db => {
  router.getUserByEmail = ({ db, email }) => {
    let queryParams = [];
    let queryString = `SELECT * FROM users `;

    queryParams.push(email);
    queryString += `WHERE users.email = $${queryParams.length};`;

    return db
      .query(queryString, queryParams)
      .then(data => {
        return data.rows[0];
      })
      .catch(err => {
        return { status: 500, error: err.emssage };
      });
  };

  router.get("/", (req, res) => {
    const currentUser = req.cookies && req.cookies.user ? req.cookies.user : null;
    let user;

    return router.getUserByEmail({ db, email: currentUser }).then(data => {
      user = data;
      res.render("index", { currentUser, user });
    });
  });

  router.get("/login", (req, res) => {
    res.render("login");
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
        res.render("index", { user: { ...result, currentUser: req.cookies.user } });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
