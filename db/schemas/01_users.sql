-- Drop and recreate Users table (Example)
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id serial PRIMARY KEY NOT NULL,
  name varchar(255) NOT NULL
);

