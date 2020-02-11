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
        return { status: 500, error: err.emssage };
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
        return { status: 500, error: err.emssage };
      });
  }
};
