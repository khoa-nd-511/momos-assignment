require("dotenv").config();

import express, { NextFunction, raw, Request, Response } from "express";
import { Client } from "@notionhq/client";
import { z } from "zod";
import {
  QueryDatabaseParameters,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import cors from "cors";
import { equal } from "assert";

const taskRowSchema = z.object({
  properties: z.object({
    completed: z.object({
      checkbox: z.boolean(),
    }),
    priority: z.object({
      status: z.object({
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
      created_time: z.string(),
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

const dateSchema = z.object({
  equals: z
    .string()
    .optional()
    .catch("")
    .transform((e) => e || ""),
  before: z
    .string()
    .optional()
    .catch("")
    .transform((e) => e || ""),
  after: z
    .string()
    .optional()
    .catch("")
    .transform((e) => e || ""),
});

interface TaskRow {
  name: string;
  status: string;
  priority: string;
  completed: boolean;
  dueDate: string;
  tags: { id: string; name: string }[];
  estimation: number;
  description: string;
  createdAt: string;
}

function getPropertyQuery<TValue = unknown>(property: string, value: TValue) {
  switch (property) {
    case "name":
      return {
        property,
        rich_text: {
          contains: String(value),
        },
      };
    case "status":
      return {
        property,
        select: {
          equals: String(value),
        },
      };
    case "priority":
      return {
        property,
        status: {
          equals: String(value),
        },
      };
    case "completed":
      return {
        property,
        checkbox: {
          equals: String(value) === "true",
        },
      };
    case "estimation":
      return {
        property,
        number: {
          equals: Number(value),
        },
      };
    case "dueDate": {
      const parsed = dateSchema.parse(value);

      if (!parsed) {
        throw new Error("Invalid date");
      }

      for (const key in parsed) {
        // @ts-ignore
        if (!parsed[key]) {
          // @ts-ignore
          delete parsed[key];
        }
      }

      return {
        property,
        date: parsed,
      };
    }
    case "tags": {
      if (Array.isArray(value)) {
        return {
          or: value.map((tag) => ({
            property,
            multi_select: {
              contains: tag,
            },
          })),
        };
      }
      throw new Error("Invalid tags filter");
    }

    case "createdAt": {
      const parsed = dateSchema.parse(value);

      if (!parsed) {
        throw new Error("Invalid date");
      }

      for (const key in parsed) {
        // @ts-ignore
        if (!parsed[key]) {
          // @ts-ignore
          delete parsed[key];
        }
      }

      return {
        timestamp: "created_time",
        created_time: parsed,
      };
    }

    default:
      throw new Error("Property not supported");
  }
}

function processQueryResults(results: QueryDatabaseResponse["results"]) {
  const list: TaskRow[] = [];
  for (const row of results) {
    const parsed = taskRowSchema.safeParse(row);

    if (!parsed.data) continue;

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

    list.push({
      name: name.title[0].plain_text,
      status: status.select.name,
      priority: priority.status.name,
      dueDate: dueDate.date.start,
      completed: completed.checkbox,
      tags: tags.multi_select.map((tag) => ({
        name: tag.name,
        id: tag.id,
      })),
      estimation: estimation.number,
      description: description.rich_text[0].plain_text,
      createdAt: createdAt.created_time,
    });
  }
  return list;
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

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
};

app.use(cors(corsOptions));

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/tasks", async (req: Request, res: Response) => {
  const rawSort = req.query.sort ? String(req.query.sort) : "";
  const rawFilter = req.query.filter || {};

  const sorts: QueryDatabaseParameters["sorts"] = [];

  if (rawSort) {
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
  }

  const timestamp = {};

  let filter: QueryDatabaseParameters["filter"] = {
    and: [],
  };

  for (const [key, value] of Object.entries(rawFilter)) {
    try {
      const f = getPropertyQuery(key, value);

      if (f.timestamp || f.created_time) {
        // handle filter with timestamp
        // @ts-ignore
        filter.and.push(f);
        continue;
      }

      filter.and.push(f);
    } catch (error) {
      console.log("error while parsing filter query", error);
      continue;
    }
  }

  const query = await notion.databases.query({
    database_id: notionDatabaseId,
    sorts,
    filter,
  });

  const list = processQueryResults(query.results);
  res.json(list);
});

app.post("/tasks", async (req: Request, res: Response) => {
  try {
    const query = await notion.databases.query({
      database_id: notionDatabaseId,
      filter: req.body,
    });

    res.json(processQueryResults(query.results));
  } catch (error) {
    console.log("error", error);
    res.json([]);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
