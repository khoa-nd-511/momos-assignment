import { z, ZodType } from "zod";

const richTextFilter = z.union([
  z.object({
    contains: z.string(),
  }),
  z.object({
    equals: z.string(),
  }),
]);

const numberFilter = z.union([
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

const checkboxFilter = z.object({
  equals: z.boolean(),
});

type TFilter = {
  property?: string;
};

type TRichTextFilter = TFilter & {
  equals?: string;
  contains?: string;
};

type TNumberFilter = TFilter & {
  equals?: number;
  less_than?: number;
  greater_than?: number;
};

type TBooleanFilter = TFilter & {
  equals?: boolean;
};

type TCompoundFilter = TRichTextFilter | TNumberFilter | TBooleanFilter;

type TFilterAndGroup = {
  and: Array<TCompoundFilter>;
};
type TFilterOrGroup = {
  or: Array<TCompoundFilter>;
};

// Define the base filter
export const compoundFilterSchema: ZodType<
  TCompoundFilter | TFilterAndGroup | TFilterOrGroup
> = z.lazy(() =>
  z.object({
    property: z.string().optional(),
    rich_text: richTextFilter.optional(),
    number: numberFilter.optional(),
    checkbox: checkboxFilter.optional(),
    and: z.array(compoundFilterSchema).optional(),
    or: z.array(compoundFilterSchema).optional(),
  })
);
