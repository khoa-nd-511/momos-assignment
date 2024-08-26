import { useFormContext } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ValueFieldMap } from "@/components/CompoundFilter/register";
import { Input } from "@/components/ui/input";

type FilterProps = {
  name: string;
  index: number;
  id: string;
  remove: (index: number) => void;
};

const CompoundFilterListItem = (props: FilterProps) => {
  const { id, index, name, remove } = props;
  const { control, getValues } = useFormContext();
  return (
    <div key={id} className="flex gap-2">
      {/* Filter Property */}
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
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      {/* Filter Operation */}
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
                <SelectItem value="less_than">Less Than</SelectItem>
                <SelectItem value="greater_than">Greater Than</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Filter Value */}
      <FormField
        name={`${name}.${index}.value`}
        control={control}
        render={(props) => {
          const ValueField =
            ValueFieldMap[getValues(`${name}.${index}.property`)] || Input;
          if (!ValueFieldMap[getValues(`${name}.${index}.property`)]) {
            console.log(
              "Component is not registered for this property. Default to Input"
            );
          }

          return (
            <FormItem>
              <FormControl>
                <ValueField {...props} />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <Button
        type="button"
        variant="ghost"
        onClick={() => {
          remove(index);
        }}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
};
export default CompoundFilterListItem;
