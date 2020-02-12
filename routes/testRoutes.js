const express = require(`express`);
const router = express.Router();
const { postPoint } = require("../lib/dataHelpers/points");
const { postMap } = require("../lib/dataHelpers/maps");

module.exports = db => {

  // router.get("/", (req, res) => {

  // });

  router.get("/", (req, res) => {
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
