module.exports = {
  getUserByID: (db, {id}) => {
    let queryParams = [];
    let queryString = `SELECT * FROM users `;

    queryParams.push(id);
    queryString += `WHERE users.id = $${queryParams.length};`;

    return db.query(queryString, queryParams)
      .then(data => {
        return data.rows[0];
      })
      .catch(err => {
        return { err };
      });
  }
};
