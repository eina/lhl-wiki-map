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

