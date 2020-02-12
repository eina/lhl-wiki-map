/* eslint-disable no-unused-vars */
const express = require(`express`);
const router = express.Router();
const { postMap, getMapByID, getMaps, deleteMapByID } = require("../lib/dataHelpers/maps");
const { postPoint, editPoint, getPointsByMapID } = require("../lib/dataHelpers/points");
const { checkFav } = require("../lib/dataHelpers/favs");

module.exports = db => {

  // router.get("/", (req, res) => {

  // });

  router.get("/", (req, res) => {
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

  router.get("/getMapByID/NowWithPoints", (req, res) => {
    getMapByID(db, {
      mapID: 3,
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

  router.get("/maps", (req, res) => {
    const today = new Date();
    postMap(db, {
      creatorID: 1,
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
