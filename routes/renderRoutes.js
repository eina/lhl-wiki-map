/* eslint-disable no-unused-vars */
const express = require(`express`);
const router = express.Router();
const moment = require("moment");

// require all helper functions
const { getUserByID, getUserByEmail } = require("../lib/dataHelpers/users");
const {
  getMapByID,
  getMaps,
  getMapsOwnedByUser,
  getMapsFavedByUser,
  getMapsEditedByUser,
  deleteMap,
  createNewMap,
  updateMap
} = require("../lib/dataHelpers/maps");
const { getPointsByMapID, createNewPoint, updatePoint } = require("../lib/dataHelpers/points");
const { checkFav, deleteFav } = require("../lib/dataHelpers/favs");
const { createNewEditRecord } = require("../lib/dataHelpers/edits");

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
        if (templateVars.currentUser && maps) {
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
      })
      .catch(err => console.log(err));
  });

  router.get("/login", (req, res) => {
    res.render("index");
  });

  router.get("/logout", (req, res) => {
    res.clearCookie("userID");
    res.render("index");
  });

  router.get("/maps/new", (req, res) => {
    const currentUser = req.cookies && req.cookies.userID ? req.cookies.userID : null;
    return getUserByID(db, { userID: currentUser }).then(user => {
      res.render("map-form", { currentUser, user, page: "create-map" });
    });
  });

  // router.get("/maps/:id/edit", (req, res) => {
  //   const currentUser = req.cookies && req.cookies.userID ? req.cookies.userID : null;
  //   let templateVars = { currentUser };
  //   return getUserByID(db, { userID: currentUser })
  //     .then(user => {
  //       templateVars = { ...templateVars, user, page: "edit-map" };
  //       return getMapByID(db, { mapID: req.params.id });
  //     })
  //     .then(mapDetails => {
  //       templateVars = { ...templateVars, map: mapDetails };
  //       res.render("map-form", templateVars);
  //     });
  // });

  router.get("/maps/:id", (req, res) => {
    const currentUser = req.cookies && req.cookies.userID ? req.cookies.userID : null;
    let templateVars = { currentUser };
    let singleMap = {};
    return getUserByID(db, { userID: currentUser })
      .then(user => {
        templateVars = { ...templateVars, user };
        return getMapByID(db, { mapID: req.params.id });
      })
      .then(mapDetails => {
        if (mapDetails.existence) {
          singleMap = { ...singleMap, ...mapDetails };
          return getUserByID(db, { userID: mapDetails.u_id });
        }
      })
      .then(user => {
        singleMap = { ...singleMap, creator: user.fullname };
        return checkFav(db, { userID: currentUser, mapID: singleMap.id });
      })
      .then(data => {
        singleMap = {
          ...singleMap,
          faved: data,
          ownedByCurrentUser: Number(currentUser) === Number(singleMap.u_id)
        };
        res.render("single-map", { ...templateVars, singleMap });
      })
      .catch(err => {
        res.render("error", { status: 404, message: "Sorry, looks like that map doesn't exist" });
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
      .then(user => getMapsOwnedByUser(db, { userID: user.id }))
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
      .then(user => getMapsFavedByUser(db, { userID: user.id }))
      .then(maps => {
        if (maps && maps.length) {
          const favMaps = maps.map(el => {
            return getUserByID(db, { userID: el.u_id }).then(data => {
              return { ...el, mapCreator: data.fullname };
            });
          });
          templateVars = { ...templateVars, maps: favMaps, currentPage: "favs" };
        }
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
      .then(user => getMapsEditedByUser(db, { userID: user.id }))
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
    const newMapObj = {
      userID: currentUser,
      mapTitle: req.query["map-title"],
      creationTime,
      ...req.body
    };
    return createNewMap(db, newMapObj).then(data => {
      const { id } = data[0].rows[0];
      res.json({ mapID: id });
    });
  });

  router.post("/points/:id/update", (req, res) => {
    // const currentUser = req.cookies && req.cookies.userID ? req.cookies.userID : null;
    const toSend = {
      title: req.query["edit-name"],
      imageURL: req.query["edit-imgURL"],
      detail: req.query["edit-description"],
      ...req.body
    };
    return updatePoint(db, { pointID: req.params.id, pointData: toSend }).then(data =>
      res.json(data.rows[0])
    );
  });
  return router;
};
