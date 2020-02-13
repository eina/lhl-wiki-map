const express = require(`express`);
const router = express.Router();
const moment = require("moment");
const {
  getUserByID,
  getUsersMaps,
  getUsersFavs,
  getUsersEdits
} = require("../lib/dataHelpers/users");
const { getMaps, getMapByID, postMap } = require("../lib/dataHelpers/maps");
const { checkFav } = require("../lib/dataHelpers/favs");
// const { getPointsByMapID } = require("../lib/dataHelpers/points");

module.exports = db => {
  router.get("/", (req, res) => {
    const currentUser = req.cookies && req.cookies.userID ? req.cookies.userID : null;
    let templateVars = { currentUser };
    return getUserByID(db, { userID: currentUser })
      .then(user => {
        templateVars = { ...templateVars, user };
        return getMaps(db);
      })
      .then(maps => {
        if (templateVars.currentUser) {
          const updatedMaps = maps.map(el => {
            return checkFav(db, { userID: templateVars.currentUser, mapID: el.id }).then(data => {
              console.log(data);
              return { ...el, favedByCurrentUser: data };
            });
          });
          templateVars = { ...templateVars, maps: updatedMaps };
        } else {
          templateVars = { ...templateVars, maps };
        }
        res.render("index", templateVars);
      });
  });

  router.get("/login", (req, res) => {
    res.render("index");
  });

  router.get("/maps/new", (req, res) => {
    const currentUser = req.cookies && req.cookies.userID ? req.cookies.userID : null;
    return getUserByID(db, { userID: currentUser }).then(user => {
      res.render("map-form", { currentUser, user, page: "create-map" });
    });
  });

  router.get("/maps/:id", (req, res) => {
    const currentUser = req.cookies && req.cookies.userID ? req.cookies.userID : null;
    let singleMap = {};
    return getMapByID(db, { mapID: req.params.id })
      .then(mapDetails => {
        singleMap = { ...singleMap, ...mapDetails };
        return getUserByID(db, { userID: mapDetails.u_id });
      })
      .then(user => {
        singleMap = { ...singleMap, creator: user.fullname };
        return checkFav(db, { userID: currentUser, mapID: singleMap.id });
      })
      .then(data => {
        singleMap = { ...singleMap, faved: data };
        res.render("single-map", { currentUser, singleMap });
      });
  });

  router.get("/users/:id", (req, res) => {
    const currentUser = req.cookies && req.cookies.userID ? req.cookies.userID : null;
    let templateVars = { currentUser };
    return getUserByID(db, { userID: req.params.id })
      .then(user => {
        templateVars = { ...templateVars, user };
        return user;
      })
      .then(user => getUsersMaps(db, { userID: user.id }))
      .then(maps => {
        templateVars = { ...templateVars, maps, currentPage: "profile" };
        res.render("profile", templateVars);
      });
  });

  router.get("/users/:id/favs", (req, res) => {
    const currentUser = req.cookies && req.cookies.userID ? req.cookies.userID : null;
    let templateVars = { currentUser };
    return getUserByID(db, { userID: req.params.id })
      .then(user => {
        templateVars = { ...templateVars, user };
        return user;
      })
      .then(user => getUsersFavs(db, { userID: user.id }))
      .then(maps => {
        const favMaps = maps.map(el => {
          return getUserByID(db, { userID: el.u_id }).then(data => {
            return { ...el, mapCreator: data.fullname };
          });
        });
        templateVars = { ...templateVars, maps: favMaps, currentPage: "favs" };
        res.render("profile", templateVars);
      });
  });

  router.get("/users/:id/activity", (req, res) => {
    const currentUser = req.cookies && req.cookies.userID ? req.cookies.userID : null;
    let templateVars = { currentUser };
    return getUserByID(db, { userID: req.params.id })
      .then(user => {
        templateVars = { ...templateVars, user };
        return user;
      })
      .then(user => getUsersEdits(db, { userID: user.id }))
      .then(activities => {
        templateVars = { ...templateVars, activities, currentPage: "activity" };
        res.render("profile", templateVars);
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

  router.post("/maps/new", (req, res) => {
    const currentUser = req.cookies && req.cookies.userID ? req.cookies.userID : null;
    const creationTime = moment()
      .format("YYYY-MM-DD HH:mm")
      .toString();
    const postObj = {
      userID: currentUser,
      mapTitle: req.query["map-title"],
      creationTime,
      ...req.body
    };
    // console.log("hello post obj", postObj);
    return postMap(db, postObj).then(data => {
      const { id } = data[0].rows[0];
      return id;
      // res.redirect(`/maps/${id}`);
    });
  });
  return router;
};
