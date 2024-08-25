import { z } from "zod";

const operationSchema = z.enum([
  "contains",
  "less_than",
  "greater_than",
  "equals",
]);

const propertyTypeSchema = z.enum([
  "rich_text",
  "number",
  "boolean",
  "multi_select",
]);

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
