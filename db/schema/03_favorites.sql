DROP TABLE IF EXISTS favorites CASCADE;

CREATE TABLE favorites (
  id serial PRIMARY KEY NOT NULL,
  u_id integer REFERENCES users (id) ON DELETE CASCADE,
  map_id integer REFERENCES maps (id) ON DELETE CASCADE
);

