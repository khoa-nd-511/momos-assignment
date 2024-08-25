import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NotionFilterProps } from "@/lib/types";
import { useState } from "react";

type SelectFilterProps<TData> = NotionFilterProps<TData, string> & {
  options: { label: string; value: string }[];
};

const SelectFilter = <TData,>({
  fieldName,
  table,
  column,
  options,
}: SelectFilterProps<TData>) => {
  const [value, setValue] = useState(
    (table.getColumn(fieldName)?.getFilterValue() || "") as string
  );

  return (
    <div className="flex flex-col gap-2">
      <Select
        value={value}
        onValueChange={(value) => {
          setValue(value);
          table.getColumn(fieldName)?.setFilterValue(value);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a status" />
        </SelectTrigger>
        <SelectContent>
          {options.map(({ label, value }) => (
            <SelectItem value={value}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        onClick={() => {
          column.setFilterValue("");
          setValue("");
        }}
        disabled={!value}
      >
        Clear filter
      </Button>
    </div>
  );
};

export default SelectFilter;
