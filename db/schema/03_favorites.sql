DROP TABLE IF EXISTS favorites CASCADE;

CREATE TABLE favorites (
  id serial PRIMARY KEY NOT NULL,
  user_id integer REFERENCES users (id),
  map_id integer REFERENCES maps (id)
);

