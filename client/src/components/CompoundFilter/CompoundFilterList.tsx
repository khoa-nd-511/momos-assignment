import { useFormContext, useFieldArray } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CompoundFilterAddRuleButton from "@/components/CompoundFilter/CompoundFilterAddRuleButton";
import CompoundFilterListItem from "@/components/CompoundFilter/CompoundFilterListItem";

type FiltersProps = {
  name: string;
  parentRemove?: () => void;
};

const CompoundFilterList = ({ name, parentRemove }: FiltersProps) => {
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
            <CompoundFilterListItem
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
              <CompoundFilterList
                name={`${name}.${index}.filters`}
                parentRemove={() => remove(index)}
              />
            </div>
          );
        }

        return null;
      })}

      <div className="flex mr-auto gap-2">
        <CompoundFilterAddRuleButton onSelect={handleAdd} />
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

export default CompoundFilterList;
