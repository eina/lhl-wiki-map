const express = require(`express`);
const router = express.Router();
const { getUserByID, getUserByEmail } = require("../lib/dataHelpers/users");
const { getMaps } = require("../lib/dataHelpers/maps");

module.exports = db => {
  router.get("/", (req, res) => {
    const currentUser = req.cookies && req.cookies.userID ? req.cookies.userID : null;
    let user;
    return getUserByID(db, { id: currentUser })
      .then(data => {
        user = data;
        return getMaps(db);
      })
      .then(maps => {
        res.render("index", { currentUser, user, maps });
      });
  });

  router.get("/login", (req, res) => {
    res.render("index");
  });

  // router.get("/maps/:id", (req, res) => {
  //   res.render("single-map");
  // });

  // router.get("/users/:id", (req, res) => {
  //   const currentUser = req.cookies && req.cookies.userID ? req.cookies.userID : null;
  //   // let user;
  //   return getUserByID(db, { id: req.params.id }).then(user => {
  //     res.render("profile", { currentUser, user });
  //     return user;
  //   });
  // });

  router.get("/maps/new", (req, res) => {
    res.render("map-form");
  });

  // // Get user given a user email address
  // router.post(`/login`, (req, res) => {
  //   let queryParams = [];
  //   let queryString = `SELECT * FROM users `;

  //   queryParams.push(req.body.userEmail);
  //   queryString += `WHERE users.email = $${queryParams.length};`;

  //   return db
  //     .query(queryString, queryParams)
  //     .then(data => {
  //       const result = data.rows[0];
  //       res.cookie("userID", data.rows[0].id);
  //       res.render("index", { user: { ...result, currentUser: req.cookies.user } });
  //     })
  //     .catch(err => {
  //       res.status(500).json({ error: err.message });
  //     });
  // });
  return router;
};
