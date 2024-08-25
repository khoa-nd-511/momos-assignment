import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CompoundFilterList from "@/components/ui/compound-filter-list";

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

const formSchema = z.object({
  filters: z.array(z.union([filterSchema, groupFiltersSchema])),
});

type FormValues = z.infer<typeof formSchema>;

const Debug = () => {
  const values = useWatch();
  return <pre>{JSON.stringify(values, null, 2)}</pre>;
};

const CompoundFilter = ({ debug }: { debug?: boolean }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      filters: [],
    },
  });

  function onSubmit(values: FormValues) {
    console.log("success", {
      and: values.filters,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Compound Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <CompoundFilterList name="filters" />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Submit</Button>
          </CardFooter>
        </Card>
        {debug && <Debug />}
      </form>
    </Form>
  );
};

export default CompoundFilter;
