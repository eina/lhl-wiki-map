SELECT
  users.id,
  edits.edited_at,
  maps.*
FROM
  users
  JOIN edits ON users.id = u_id
  JOIN maps ON maps.id = edits.map_id
WHERE
  users.id = 1
