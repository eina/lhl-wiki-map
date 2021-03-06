/* eslint-disable no-unused-vars */
const express = require(`express`);
const router = express.Router();

const { createNewEdit } =
  require("../lib/dataHelpers/edits");

const { getUsersFavs } =
  require("../lib/dataHelpers/users");

const { createNewMap, getMapByID, getMaps, deleteMapByID, getMapsFavedByUser, editMap, getMapsOwnedByUser, getMapsEditedByUser } =
  require("../lib/dataHelpers/maps");

const { createNewPoint, editPoint, getPointsByMapID, deletePoint } =
  require("../lib/dataHelpers/points");

const { checkFav, deleteFav } =
  require("../lib/dataHelpers/favs");


module.exports = db => {

  router.get("/", (req, res) => {
    getMapsEditedByUser(db, {userID:1}).then(data => {
      res.json(data);
    });
  });

  router.get("/deletePoint", (req, res) => {
    deletePoint(db, {
      pointID: 1
    }).then(data => {
      res.json(data);
    });
  });

  router.get("/createNewMap", (req, res) => {
    const today = new Date();
    createNewMap(db, {
      userID: 1,
      mapTitle: 'The Forbidden Map',
      creationTime: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(),
      centerLat: 50,
      centerLng: -123,
      points: [
        {
          title: 'Title',
          detail: 'Details are important.',
          imageURL: 'https://source.unsplash.com/random/800x600',
          lat: 50,
          lng: - 120,
        },
        {
          title: 'Title',
          detail: 'Details are important.',
          imageURL: 'https://source.unsplash.com/random/800x600',
          lat: 50,
          lng: - 120,
        },
        {
          title: 'Title',
          detail: 'Details are important.',
          imageURL: 'https://source.unsplash.com/random/800x600',
          lat: 50,
          lng: - 120,
        },
        {
          title: 'Title',
          detail: 'Details are important.',
          imageURL: 'https://source.unsplash.com/random/800x600',
          lat: 50,
          lng: - 120,
        },
        {
          title: 'Title',
          detail: 'Details are important.',
          imageURL: 'https://source.unsplash.com/random/800x600',
          lat: 50,
          lng: - 120,
        },
      ],
    }).then(data => {
      res.json(data);
    });
  });

  router.get("/getMapByID", (req, res) => {
    getMapByID(db, {
      mapID: 9,
    }).then(data => {
      res.json(data);
    });
  });

  router.get("/editMap", (req, res) => {
    editMap(db, {
      mapID: 1,
      mapData: {
        mapTitle: 'NEW GEN MAP',
        centerLat: 69,
        centerLng: 420
      }
    }).then(data => {
      res.json(data);
    });
  });

  router.get("/createNewEdit", (req, res) => {
    const today = new Date();
    createNewEdit(db, {
      userID: 2,
      mapID: 1,
      creationTime: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(),
    }).then(data => {
      res.json(data);
    });
  });

  router.get("/getMapsFavedByUser", (req, res) => {
    getMapsFavedByUser(db, { userID: 1 }).then(data => {
      res.json(data);
    });
  });

  router.get("/deleteFav", (req, res) => {
    deleteFav(db, {
      mapID: 1
    }).then(data => {
      res.json(data);
    });
  });

  router.get("/deleteMapByID", (req, res) => {
    deleteMapByID(db, {
      mapID: 1
    }).then(data => {
      res.json(data);
    });
  });

  router.get("/getPointsByMapID", (req, res) => {
    getPointsByMapID(db, {
      mapID: 2,
    }).then(data => {
      res.json(data);
    });
  });

  router.get("/editPoint", (req, res) => {
    editPoint(db, {
      pointID: 1,
      pointData: {
        mapID: 5,
        title: 'NEW GEN MAP',
        detail: 'CRIME AND PUNISHMENT',
        imageURL: 'GOOGLE',
        lat: 69,
        lng: 420
      }
    }).then(data => {
      res.json(data);
    });
  });

  router.get("/checkFav", (req, res) => {
    checkFav(db, {userID:1, mapID:1}).then(data => {
      res.json(data);
    });
  });

  router.get("/getMapByID", (req, res) => {
    getMapByID(db, { mapID: 2 }).then(data => {
      res.json(data);
    });
  });

  return router;
};
