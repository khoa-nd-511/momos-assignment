import { z } from "zod";
import {
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlus, PlusIcon, X } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  property: z.string().optional(),
  propertyType: propertyTypeSchema.optional(),
  operation: operationSchema.optional(),
  value: z.union([z.string(), z.number(), z.boolean()]).optional(),
});

const groupFiltersSchema = z.object({
  operator: z.enum(["and", "or"]).optional(),
  filters: z.array(filterSchema),
});

const formSchema = z.object({
  filters: z.array(z.union([filterSchema, groupFiltersSchema])),
});

type FormValues = z.infer<typeof formSchema>;

type FilterProps = {
  name: string;
  index: number;
  id: string;
  remove: (index: number) => void;
};

const FilterItem = (props: FilterProps) => {
  const { id, index, name, remove } = props;
  const { control } = useFormContext();
  return (
    <div key={id} className="flex gap-2">
      <FormField
        name={`${name}.${index}.property`}
        control={control}
        render={({ field }) => {
          return (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="estimation">Estimation</SelectItem>
                  <SelectItem value="tags">Tags</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        name={`${name}.${index}.operation`}
        control={control}
        render={({ field }) => (
          <FormItem>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="equals">Equals</SelectItem>
                <SelectItem value="contains">Contains</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name={`${name}.${index}.value`}
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input {...field} value={field.value as string} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button variant="ghost" onClick={() => remove(index)}>
        <X />
      </Button>
    </div>
  );
};

type FiltersProps = {
  name: string;
  parentRemove?: () => void;
};

const AddRuleButton = ({
  onSelect,
}: {
  onSelect: (type: "rule" | "group") => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="col-start-2 mr-auto">
          Add rule
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={() => onSelect("rule")}>
          <PlusIcon />
          Add Filter rule
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelect("group")}>
          <FilePlus />
          Add Filter group
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FiltersField = ({ name, parentRemove }: FiltersProps) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name,
    control: control,
  });

  function handleAdd(type: "rule" | "group") {
    if (type === "rule") {
      append({
        property: "name",
        propertyType: "rich_text",
        operation: "equals",
        value: "",
      });
    } else if (type === "group") {
      append({
        operator: "and",
        filters: [],
      });
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {fields.map((field, index) => {
        if ("property" in field) {
          return (
            <FilterItem
              key={field.id}
              id={field.id}
              index={index}
              name={name}
              remove={remove}
            />
          );
        }

        if (
          "filters" in field &&
          "operator" in field &&
          typeof field.operator === "string"
        ) {
          return (
            <div
              key={field.id}
              className={cn(
                "grid grid-cols-[100px_1fr] gap-2 border-2 border-slate-300 rounded-md p-4",
                {
                  "mt-2": index > 0,
                }
              )}
            >
              <FormField
                name={`${name}.${index}.operator`}
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="and">AND</SelectItem>
                        <SelectItem value="or">OR</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FiltersField
                name={`${name}.${index}.filters`}
                parentRemove={() => remove(index)}
              />
            </div>
          );
        }

        return null;
      })}

      <div className="flex mr-auto gap-2">
        <AddRuleButton onSelect={handleAdd} />
        {parentRemove && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              parentRemove();
            }}
          >
            Remove group
          </Button>
        )}
      </div>
    </div>
  );
};

const Debug = () => {
  const values = useWatch();
  return <pre>{JSON.stringify(values, null, 2)}</pre>;
};

const CompoundFilter = () => {
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
            <FiltersField name="filters" />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Submit</Button>
          </CardFooter>
        </Card>
        <Debug />
      </form>
    </Form>
  );
};

export default CompoundFilter;
