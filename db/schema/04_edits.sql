DROP TABLE IF EXISTS edits CASCADE;

CREATE TABLE edits (
  id serial PRIMARY KEY NOT NULL,
  user_id integer REFERENCES users (id),
  map_id integer REFERENCES maps (id),
  edited_at timestamp
);

