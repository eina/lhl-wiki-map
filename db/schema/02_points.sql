DROP TABLE IF EXISTS points CASCADE;

CREATE TABLE points (
  id serial PRIMARY KEY NOT NULL,
  map_id integer REFERENCES maps (id) ON DELETE CASCADE,
  title varchar,
  detail varchar,
  image_url varchar,
  lat double precision,
  lng double precision
);

