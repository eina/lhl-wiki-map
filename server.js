// load .env data into process.env
require(`dotenv`).config();

// Web server config
const PORT          = process.env.PORT || 8080;
const ENV           = process.env.ENV || `development`;
const express       = require(`express`);
const bodyParser    = require(`body-parser`);
const sass          = require(`node-sass-middleware`);
const cookieParser  = require(`cookie-parser`);
const app           = express();
const morgan        = require(`morgan`);

// PG database client/connection setup
const { Pool } = require(`pg`);
const dbParams = require(`./lib/db.js`);
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// `dev` = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan(`dev`));

// use cookie-parser
app.use(cookieParser());


app.set(`view engine`, `ejs`);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(`/styles`, sass({
  src: __dirname + `/styles`,
  dest: __dirname + `/public/styles`,
  debug: true,
  outputStyle: `expanded`
}));
app.use(express.static(`public`));

// Separated Routes for each Resource
const interactFav = require(`./routes/interactFav`);

const usersAPI = require(`./routes/api/users`);
const mapsAPI = require(`./routes/api/maps`);

// Mount all resource routes
app.use(`/test/f`, interactFav(db));

app.use(`/api/users`, usersAPI(db));
app.use(`/api/maps`, mapsAPI(db));

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get(`/`, (req, res) => {
  // [Test Code]
  res.cookie(`userID`, `1`);
  console.log(req.cookies);
  // [Test Code End]

  res.render(`index`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
