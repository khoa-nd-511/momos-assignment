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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type FilterProps = {
  name: string;
  index: number;
  id: string;
  remove: (index: number) => void;
};

const CompoundFilterListItem = (props: FilterProps) => {
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
export default CompoundFilterListItem;
