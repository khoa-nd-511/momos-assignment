# Notion Table View and Filters

## Features

- Build table view UI ✅
- Support sorting ✅
- Support column rearrangement ✅
  - This feature is built from scratch using html drag events. There is an issue where the column overlay is being placed wrongly on the table if the container is being scrolled horizontally. It can be fixed easily by checking the current scroll left of the container element and add it to the `left` value as an offset. However, it requries modifying the ui lib I'm using (shadcn ui table).
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

Run client test

```
cd client
yarn test
```
