SELECT
  users.id,
  maps.*
FROM
  users
  JOIN favorites ON users.id = u_id
  JOIN maps ON maps.id = favorites.map_id
WHERE
  users.id = 1
