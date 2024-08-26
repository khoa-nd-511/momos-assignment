import { useForm, useWatch } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
import { noop } from "@tanstack/react-table";

import CompoundFilterList from "@/components/CompoundFilter/CompoundFilterList";
import { register } from "@/components/CompoundFilter/register";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { parseCompoundFilter } from "@/lib/utils";
// import { formSchema } from "@/lib/validation";
import { CompoundFilterFormValues } from "@/lib/types";

const Debug = () => {
  const values = useWatch();
  return <pre>{JSON.stringify(values, null, 2)}</pre>;
};

const CompoundFilter = ({
  debug,
  onChange = noop,
}: {
  debug?: boolean;
  onChange?: (values: unknown) => void;
}) => {
  const form = useForm<CompoundFilterFormValues>({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      filters: [],
    },
  });

  const onSubmit = (values: CompoundFilterFormValues) => {
    const res = parseCompoundFilter(values.filters);
    onChange({ and: res });
  };

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

register({
  name: "name",
  propertyType: "rich_text",
  field: ({ field }) => <Input {...field} />,
  options: [
    {
      label: "Equals",
      value: "equals",
    },
    {
      label: "Contains",
      value: "contains",
    },
  ],
});
register({
  name: "estimation",
  propertyType: "number",
  field: ({ field }) => (
    <Input
      type="number"
      {...field}
      onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
    />
  ),
  options: [
    {
      label: "Equals",
      value: "equals",
    },
    {
      label: "Less Than",
      value: "less_than",
    },
    {
      label: "Greater Than",
      value: "greater_than",
    },
  ],
});
register({
  name: "completed",
  propertyType: "checkbox",
  field: ({ field }) => (
    <Select
      value={String(field.value)}
      onValueChange={(v) => field.onChange(v === "true")}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="true">Completed</SelectItem>
        <SelectItem value="false">Not Completed</SelectItem>
      </SelectContent>
    </Select>
  ),
  options: [
    {
      label: "Equals",
      value: "equals",
    },
  ],
});

export default CompoundFilter;
