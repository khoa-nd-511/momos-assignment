require("dotenv").config();

import express, { NextFunction, Request, Response } from "express";
import { Client } from "@notionhq/client";
import { z } from "zod";
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";

const taskRowSchema = z.object({
  properties: z.object({
    completed: z.object({
      checkbox: z.boolean(),
    }),
    priority: z.object({
      select: z.object({
        name: z.string(),
      }),
    }),
    tags: z.object({
      multi_select: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
        })
      ),
    }),
    status: z.object({
      select: z.object({
        name: z.string(),
      }),
    }),
    estimation: z.object({
      number: z.number(),
    }),
    dueDate: z.object({
      date: z.object({
        start: z.string(),
      }),
    }),
    createdAt: z.object({
      date: z.object({
        start: z.string(),
      }),
    }),
    description: z.object({
      rich_text: z.array(
        z.object({
          plain_text: z.string(),
        })
      ),
    }),
    name: z.object({
      title: z.array(
        z.object({
          plain_text: z.string(),
        })
      ),
    }),
  }),
});

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
app.get("/tasks", async (req: Request, res: Response) => {
  const rawSort = String(req.query.sort) || "";

  const sorts: QueryDatabaseParameters["sorts"] = [];

  for (const property of rawSort.split(",")) {
    if (property.startsWith("-")) {
      sorts.push({
        property: property.slice(1),
        direction: "descending",
      });
    } else {
      sorts.push({
        property: property,
        direction: "ascending",
      });
    }
  }

  const query = await notion.databases.query({
    database_id: notionDatabaseId,
    sorts,
  });

  const list = query.results.map((row) => {
    const parsed = taskRowSchema.safeParse(row);

    if (!parsed.data) return null;

    const {
      properties: {
        completed,
        createdAt,
        description,
        dueDate,
        estimation,
        name,
        priority,
        status,
        tags,
      },
    } = parsed.data;

    return {
      name: name.title[0].plain_text,
      status: status.select.name,
      priority: priority.select.name,
      dueDate: dueDate.date.start,
      completed: completed.checkbox,
      tags: tags.multi_select.map((tag) => ({
        name: tag.name,
        id: tag.id,
      })),
      estimation: estimation.number,
      description: description.rich_text[0].plain_text,
      createdAt: createdAt.date.start,
    };
  });
  res.json(list);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
