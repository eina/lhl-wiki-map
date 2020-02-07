# DataTypes

## ERD

![Wiki Maps Schema](./wiki_maps_erd.png "Wiki Maps Schema")

## Users

```js
{
  id: PK int,
  email: string,
}
```

## Maps

```js
{
  id: PK int,
  owner_id: FK int,
  title: string,
  created_at: timestamp,
}
```

## Points

```js
{
  id: PK int,
  map_id: FK int,
  title: string,
  detail: string,
  image_url: string,
  lat: int,
  lng: int,
}
```

## Favorites

```js
{
  id: PK int,
  user_id: FK int,
  map_id: FK int,
}
```

## Edits

```js
{
  id: PK int,
  user_id: FK int,
  map_id: FK int,
  edited_at: timestamp,
}
```
