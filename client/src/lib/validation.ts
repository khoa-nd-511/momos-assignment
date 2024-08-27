import { z, ZodType } from "zod";

const richTextNotionFilterSchema = z.union([
  z.object({
    contains: z.string(),
  }),
  z.object({
    equals: z.string(),
  }),
]);

const numberNotionFilterShema = z.union([
  z.object({
    equals: z.number(),
  }),
  z.object({
    less_than: z.number(),
  }),
  z.object({
    greater_than: z.number(),
  }),
]);

const checkboxNotionFilterSchema = z.object({
  equals: z.boolean(),
});

type TNotionFilter = {
  property?: string;
};

type TNotionRichTextFilter = TNotionFilter & {
  equals?: string;
  contains?: string;
};

type TNotionNumberFilter = TNotionFilter & {
  equals?: number;
  less_than?: number;
  greater_than?: number;
};

type TNotionBooleanFilter = TNotionFilter & {
  equals?: boolean;
};

type TCompoundFilter =
  | TNotionRichTextFilter
  | TNotionNumberFilter
  | TNotionBooleanFilter;

type TNotionFilterAndGroup = {
  and: Array<TCompoundFilter>;
};
type TNotionFilterOrGroup = {
  or: Array<TCompoundFilter>;
};

type TNotionCompoundFilter =
  | TCompoundFilter
  | TNotionFilterAndGroup
  | TNotionFilterOrGroup;

export const notionCompoundFilterSchema: ZodType<TNotionCompoundFilter> =
  z.lazy(() =>
    z.object({
      property: z.string().optional(),
      rich_text: richTextNotionFilterSchema.optional(),
      number: numberNotionFilterShema.optional(),
      checkbox: checkboxNotionFilterSchema.optional(),
      and: z.array(notionCompoundFilterSchema).optional(),
      or: z.array(notionCompoundFilterSchema).optional(),
    })
  );

const baseFilterSchema = z.object({
  property: z.string(),
});

const richTextFilterSchema = baseFilterSchema.extend({
  propertyType: z.literal("rich_text"),
  operation: z.enum(["equals", "contains"]),
  value: z.string().optional(),
});

const numberFilterSchema = baseFilterSchema.extend({
  propertyType: z.literal("number"),
  operation: z.enum(["equals", "less_than", "greater_than"]),
  value: z.number().optional(),
});

const checkboxFilterSchema = baseFilterSchema.extend({
  propertyType: z.literal("checkbox"),
  operation: z.enum(["equals"]),
  value: z.enum(["true", "false"]).optional(),
});

const singleFilterSchema = z.union([
  richTextFilterSchema,
  numberFilterSchema,
  checkboxFilterSchema,
]);

type TSingleFilter = z.infer<typeof singleFilterSchema>;

type TGroupFilter = {
  operator: "and" | "or";
  filters: (TSingleFilter | TGroupFilter)[];
};

const groupFilterSchema: ZodType<TGroupFilter> = z.object({
  operator: z.enum(["and", "or"]),
  filters: z.lazy(() =>
    z.union([singleFilterSchema, groupFilterSchema]).array()
  ),
});

export const compoundFilterFormSchema = z.object({
  filters: z.array(z.union([singleFilterSchema, groupFilterSchema])),
});
