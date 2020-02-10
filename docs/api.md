# API

All Get results are returned as JSON.

```/api/users```

- ```GET /all``` - Get all users  
Returns the whole users table.

- ```GET /current``` - Get the logged-in user based on data in cookie  
Returns all data (*) about the user.

- ```GET /email/:userEmail``` - Get user given a user email address  
Returns all data (*) about the user.

- ```GET /id/:userID``` - Get user given a user ID  
Returns all data (*) about the user.


```/api/maps```

- ```GET /all``` - Get all maps  
Returns all data (*), with the full name of the user, and the number of favorites.

- ```GET /u/:userID``` - Get all maps owned by a user given a user ID

- ```GET /u/:userID/favs``` - Get all maps faved by a user given a user ID

- ```GET /u/:userID/edits``` - Move this to edits
