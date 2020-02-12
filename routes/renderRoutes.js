const express = require(`express`);
const router = express.Router();
const { getUserByID, getUsersMaps } = require("../lib/dataHelpers/users");
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

  router.get("/users/:id", (req, res) => {
    const currentUser = req.cookies && req.cookies.userID ? req.cookies.userID : null;
    let templateVars = { currentUser };
    return getUserByID(db, { id: req.params.id })
      .then(user => {
        templateVars = { ...templateVars, user };
        return user;
      })
      .then(user => {
        return getUsersMaps(db, { userID: user.id });
      })
      .then(maps => {
        templateVars = { ...templateVars, maps, currentPage: "profile" };
        console.log(templateVars);
        res.render("profile", templateVars);
      });
  });

  router.get("/users/:id/favs", (req, res) => {
    const currentUser = req.cookies && req.cookies.userID ? req.cookies.userID : null;
    // let user;
    return getUserByID(db, { id: req.params.id }).then(user => {
      res.render("profile", { currentUser, user, currentPage: "favs" });
      return user;
    });
  });

  router.get("/users/:id/activity", (req, res) => {
    const currentUser = req.cookies && req.cookies.userID ? req.cookies.userID : null;
    // let user;
    return getUserByID(db, { id: req.params.id }).then(user => {
      res.render("profile", { currentUser, user, currentPage: "activity" });
      return user;
    });
  });

  router.get("/maps/new", (req, res) => {
    res.render("map-form");
  });

  router.post(`/login`, (req, res) => {
    let queryParams = [];
    let queryString = `SELECT * FROM users `;

    queryParams.push(req.body.userEmail);
    queryString += `WHERE users.email = $${queryParams.length};`;

    return db
      .query(queryString, queryParams)
      .then(data => {
        const result = data.rows[0];
        res.cookie("userID", data.rows[0].id);
        res.render("index", { user: { ...result, currentUser: req.cookies.user } });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
