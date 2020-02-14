const moment = require("moment");

module.exports = {
  createNewEditRecord: (db, { userID, mapID }) => {
    const creationTime = moment()
      .format("YYYY-MM-DD HH:mm")
      .toString();

    let queryParams = [];
    let queryString = `INSERT INTO edits (u_id, map_id, edited_at) `;

    queryParams.push(userID, mapID, creationTime);
    queryString += `VALUES ($1, $2, $3) RETURNING *;`;

    return db
      .query(queryString, queryParams)
      .then(data => data)
      .catch(err => {
        return { status: 500, error: err.message };
      });
  },
};
