module.exports = {
  checkFav: (db, { userID, mapID }) => {
    let queryParams = [];
    let queryString = `
    SELECT EXISTS(SELECT 1 FROM favorites
    `;

    queryParams.push(userID, mapID);
    queryString += `WHERE u_id = $1 AND map_id = $2);`;

    return db
      .query(queryString, queryParams)
      .then(data => data.rows[0].exists)
      .catch(err => {
        return { status: 500, error: err.message };
      });
  }
};
