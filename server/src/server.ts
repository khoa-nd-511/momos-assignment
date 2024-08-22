require("dotenv").config();

import express, { NextFunction, Request, Response } from "express";
import { Client } from "@notionhq/client";

interface ThingToLearn {
  label: string;
  url: string;
}

// The dotenv library will read from your .env file into these values on `process.env`
const notionDatabaseId = process.env.NOTION_DB_ID;
const notionSecret = process.env.NOTION_SECRET;

// Will provide an error to users who forget to create the .env file
// with their Notion data in it
if (!notionDatabaseId || !notionSecret) {
  throw Error("Must define NOTION_SECRET and NOTION_DB_ID in env");
}

// Initializing the Notion client with your secret
const notion = new Client({
  auth: notionSecret,
});

const app = express();
const port = 3000;

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// GET request handler
app.get("/", async (req: Request, res: Response) => {
  const query = await notion.databases.query({
    database_id: notionDatabaseId,
  });
  const list = query.results.map((row) => {
    if (!("properties" in row)) {
      return { label: "NOT_FOUND", url: "" };
    }

    console.log("row", row);

    const labelCell = row.properties.label;
    const urlCell = row.properties.url;
    const finishedCell = row.properties.finished;
    const createdAtCell = row.properties.createdAt;

    const isLabel = labelCell.type === "rich_text";
    const isUrl = urlCell.type === "url";
    const isFinished = finishedCell.type === "checkbox";
    const isCreatedAt = createdAtCell.type === "date";

    if (
      isLabel &&
      isUrl &&
      isFinished &&
      isCreatedAt &&
      labelCell.rich_text instanceof Array
    ) {
      const label = labelCell.rich_text[0].plain_text;
      const url = urlCell.url ?? "";
      const finished = finishedCell.checkbox;
      const createdAt = createdAtCell.date?.start;

      return { label, url, finished, createdAt };
    }
  });
  res.json(list);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
