module.exports = {
  getUserByID: (db, { id }) => {
    let queryParams = [];
    let queryString = `SELECT * FROM users `;

    queryParams.push(id);
    queryString += `WHERE users.id = $${queryParams.length};`;

    return db
      .query(queryString, queryParams)
      .then(data => data.rows[0])
      .catch(err => {
        return { status: 500, error: err.message };
      });
  },

  getUserByEmail: (db, { email }) => {
    let queryParams = [];
    let queryString = `SELECT * FROM users `;

    queryParams.push(email);
    queryString += `WHERE users.email = $${queryParams.length};`;

    return db
      .query(queryString, queryParams)
      .then(data => {
        return data.rows[0];
      })
      .catch(err => {
        return { status: 500, error: err.message };
      });
  },

  getUsersMaps: (db, { userID }) => {
    let queryParams = [];
    let queryString = `
    SELECT
      maps.*,
      users.fullname AS owner_name,
      count(favorites.*) AS fav_count
    FROM
      maps
      JOIN users ON users.id = u_id
      JOIN favorites ON maps.id = map_id `;

    queryParams.push(userID);
    queryString += `WHERE users.id = $${queryParams.length} `;

    queryString += `
    GROUP BY
      maps.id,
      users.fullname
    ORDER BY
      fav_count DESC,
      maps.id ASC;
    `;

    return db
      .query(queryString, queryParams)
      .then(data => {
        return data.rows;
      })
      .catch(err => {
        return { status: 500, error: err.message };
      });
  },

  getUsersFavs: (db, { userID }) => {
    let queryParams = [];
    let queryString = `
      SELECT
        users.id,
        maps.*
      FROM
        users
        JOIN favorites ON users.id = u_id
        JOIN maps ON maps.id = favorites.map_id
      `;

    queryParams.push(userID);
    queryString += `WHERE favorites.u_id = $${queryParams.length};`;

    return db
      .query(queryString, queryParams)
      .then(data => {
        return data.rows;
      })
      .catch(err => {
        return { status: 500, error: err.message };
      });
  },

  getUsersEdits: (db, { userID }) => {
    let queryParams = [];
    let queryString = `
      SELECT
        edits.edited_at,
        maps.*
      FROM
        users
        JOIN edits ON users.id = u_id
        JOIN maps ON maps.id = edits.map_id
      `;

    queryParams.push(userID);
    queryString += `WHERE users.id = $${queryParams.length} `;

    queryString += `
      ORDER BY
        edits.edited_at DESC;
      `;

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
