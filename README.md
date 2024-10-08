# Notion Table View and Filters

## Features

- Build table view UI ✅
- Support sorting ✅
- Support column rearrangement ✅
- Support column resize ✅
- Support column filters (`checkbox` , `date` , `multi_select` , `number` , `rich_text` , `select` , `timestamp` , `status`) ✅
- Support Compound filter ✅
  - Currently there are 3 types being supported in the compound filter (`rich_text`, `checkbox`, `number`). However, it can easily be extended to support other types by using the `register` funtion'.

```js
register({
  name: "name",
  propertyType: "rich_text",
  field: ({ field }) => <Input {...field} placeholder="Enter task name..." />,
  options: [
    { label: "Equals", value: "equals" },
    { label: "Contains", value: "contains" },
  ],
});
```

- Implement unit test for Compound filter ✅
- Support not operator ❌
  - Not implemented yet

## Run the project

Clone the project:

```
git clone https://github.com/khoa-nd-511/momos-assignment.git

cd momos-assignment
```

Create .env file with values provided from email

Run the project

```
docker-compose up -d
```

Visit [http://localhost:5173](http://localhost:5173)

Run client test

```
cd client
yarn test
```
