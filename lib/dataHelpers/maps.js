module.exports = {
  getMaps: db => {
    let queryParams = [];
    let queryString = `
    SELECT
      maps.*,
      users.fullname AS owner_name,
      count(favorites.*) AS fav_count
    FROM
      maps
      JOIN users ON users.id = u_id
      JOIN favorites ON maps.id = map_id
    GROUP BY
      maps.id,
      users.fullname
    ORDER BY
      fav_count DESC,
      maps.id ASC;
    `;

    return db
      .query(queryString, queryParams)
      .then(data => data.rows)
      .catch(err => {
        return { status: 500, error: err.message };
      });
  },

  getMapByID: (db, { id }) => {
    let queryParams = [];
    let queryString = `SELECT * FROM maps `;

    queryParams.push(id);
    queryString += `WHERE maps.id = $${queryParams.length};`;

    return db
      .query(queryString, queryParams)
      .then(data => {
        return data.rows;
      })
      .catch(err => {
        return { status: 500, error: err.message };
      });
  }
};
