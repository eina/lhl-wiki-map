DROP TABLE IF EXISTS maps CASCADE;

CREATE TABLE maps (
  id serial PRIMARY KEY NOT NULL,
  u_id integer REFERENCES users (id),
  title varchar,
  created_at timestamp
);

