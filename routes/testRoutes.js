/* eslint-disable no-unused-vars */
const express = require(`express`);
const router = express.Router();

const { postEdit } =
  require("../lib/dataHelpers/edits");

const { getUsersFavs } =
  require("../lib/dataHelpers/users");

const { postMap, getMapByID, getMaps, deleteMapByID, getMapsFavedByUser, editMap } =
  require("../lib/dataHelpers/maps");

const { postPoint, editPoint, getPointsByMapID, deletePoint } =
  require("../lib/dataHelpers/points");

const { checkFav, deleteFav } =
  require("../lib/dataHelpers/favs");


module.exports = db => {
  router.get("/deletePoint", (req, res) => {
    deletePoint(db, {
      pointID: 1
    }).then(data => {
      res.json(data);
    });
  });

  router.get("/postMap", (req, res) => {
    const today = new Date();
    postMap(db, {
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

  router.get("/postEdit", (req, res) => {
    const today = new Date();
    postEdit(db, {
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

  router.get("/getMaps", (req, res) => {
    getMaps(db).then(data => {
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

  router.get("/point", (req, res) => {
    postPoint(db, {
      mapID: 1,
      title: 'Title',
      detail: 'Details are important.',
      imageURL: 'https://source.unsplash.com/random/800x600',
      lat: 50,
      lng: - 120,
    }).then(data => {
      res.json(data);
    });
  });

  return router;
};
