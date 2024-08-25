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
import { parseCompoundFilter } from "@/lib/utils";
import { formSchema } from "@/lib/validation";
import { CompoundFilterFormValues } from "@/lib/types";

const Debug = () => {
  const values = useWatch();
  return <pre>{JSON.stringify(values, null, 2)}</pre>;
};

const CompoundFilter = ({ debug }: { debug?: boolean }) => {
  const form = useForm<CompoundFilterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      filters: [],
    },
  });

  const onSubmit = (values: CompoundFilterFormValues) => {
    parseCompoundFilter(values.filters);
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

export default CompoundFilter;
