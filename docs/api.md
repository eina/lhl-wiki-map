# API

All Get results are returned as JSON.



## ```/api/users```

- ```GET /all``` - Get all users.
Returns the whole users table.

- ```GET /current``` - Get the logged-in user, based on data in cookie.
Returns all data (*) about the user.

- ```GET /email/:userEmail``` - Get the user, given a user email address.
Returns all data (*) about the user.

- ```GET /:userID``` - Get the user, given a user ID.
Returns all data (*) about the user.

- ```GET /:userID/maps``` - Get all the maps a user owns.

- ```GET /:userID/favs``` - Get all the maps a user favorites.

- //TODO repercise this ```GET /:userID/edits``` - Get the edit history of the user.



## ```/api/maps```

- ```GET /all``` - Get all maps.
Returns all data (*), with the full name of the creator, and the number of favorites.

- ```GET /u/:userID``` - Get all maps owned by the user, given a user ID.
Returns all data (*), with the full name of the creator, and the number of favorites.

- ```GET /u/:userID/favs``` - Get all maps faved by the user, given a user ID.
Returns all data (*), with the full name of the creator

- ```GET /:mapID``` - Get the map, given a map ID.
Returns all data (*) about the map.

- //TODO Implement ```GET /:mapID/points```

- ```DELETE /:mapID``` - Delete the map from database, given a map ID.



## ```/api/points```

- //TODO Get data by ID


## ```/api/favs```

- ```POST /u/:userID/m/:mapID``` - Create a new "favorite" relationship, with given userID and mapID.

- ```DELETE /u/:userID/m/:mapID``` - Delete the relationship from database, with given userID and mapID.

- ```DELETE /:favID``` - Delete the relationship from database, given a fav ID.

- //TODO Get data by ID



## ```/api/edits```

- ```GET /u/:userID``` - Get all maps edited by the user, given a user ID.

- //TODO Get data by ID

- //TODO Create new edit.





