import { z } from "zod";

const operationSchema = z.enum([
  "contains",
  "less_than",
  "greater_than",
  "equals",
]);

const propertyTypeSchema = z.enum(["rich_text", "number", "checkbox"]);

const filterSchema = z.object({
  property: z.string(),
  propertyType: propertyTypeSchema,
  operation: operationSchema,
  value: z.union([z.string(), z.number(), z.boolean()]),
});

const groupFiltersSchema = z.object({
  operator: z.enum(["and", "or"]),
  filters: z.array(filterSchema),
});

export const formSchema = z.object({
  filters: z.array(z.union([filterSchema, groupFiltersSchema])),
});

const richTextFilterSchema = z.object({
  property: z.string(),
  rich_text: z.union([
    z.object({
      contains: z.string(),
    }),
    z.object({
      equals: z.string(),
    }),
  ]),
});
const numberFilterSchema = z.object({
  property: z.string(),
  number: z.union([
    z.object({
      equals: z.number(),
    }),
    z.object({
      less_than: z.number(),
    }),
    z.object({
      greater_than: z.number(),
    }),
  ]),
});
const checkboxFilterSchema = z.object({
  property: z.string(),
  checkbox: z.object({
    equals: z.boolean(),
  }),
});

export const compoundFilterSchema = z.union([
  richTextFilterSchema,
  numberFilterSchema,
  checkboxFilterSchema,
]);

export const compoundFiltersSchema = z.union([
  compoundFilterSchema,
  z.object({
    and: z.array(compoundFilterSchema),
  }),
  z.object({
    or: z.array(compoundFilterSchema),
  }),
]);
