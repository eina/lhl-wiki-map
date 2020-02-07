-- Drop and recreate Widgets table (Example)
DROP TABLE IF EXISTS widgets CASCADE;

CREATE TABLE widgets (
  id serial PRIMARY KEY NOT NULL,
  user_id integer REFERENCES users (id),
  name varchar(255) NOT NULL
);

