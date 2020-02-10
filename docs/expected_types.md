# Expected Types

*Kevin:* \
*~~Slightly~~ VERY outdated, ~~since datatypes and ERD got updated~~ I'm not even sure if anyone uses this page.* \
*Refer to [datatypes.md](./datatypes.md) for correct datatypes.*

Expected types for methods

## /user

- **expected**: _object_

```js
user {
  id: number,
  email: string,
}
```

## /maps

- **expected**: _array_ with 12 _objects_
- user object above, if user is logged in
- figure out thumbnails - does it show the points? is it live????

```js
maps[
  {
    id: number,
    title: string,
    owner_name: string
    owner_id: number,
    number_of_faves: number,
    timestamp: Date object
  },
  {...}
];
```

## /map/:id

**expected**: _object_ with three keys

- user, if there is a user
- map object: {id, title, owner, number_of_faves, created_at}
- array of people who've faved map: [{name, id, timestamp}]
- points : [{ id, lat, lng, text, description, image }]
