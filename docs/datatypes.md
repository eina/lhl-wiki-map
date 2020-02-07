# DataTypes

todo: figure out how and where to store user map activity

## users

```js
{
  id: integer,
  email: string,
}
```

## maps

```js
{
  id: PK integer,
  owner_id: FK integer,
  title: varchar(255),
  created_on: timestamp,
  is_editable: bool
}
```

## points

```js
{
  id: PK int,
  map_id: FK integer,
  lat: int,
  lng: int,
  title: varchar(255),
  image: string,
  description: string?
}
```

## users_fave

```js
{
  id: PK int,
  user_id: FK int,
  map_id: FK int
}
```
