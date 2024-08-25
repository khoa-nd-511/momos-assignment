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

const SelectFilter = <TData,>({
  fieldName,
  table,
  column,
}: NotionFilterProps<TData, string>) => {
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
          <SelectItem value="ready">Ready</SelectItem>
          <SelectItem value="doing">Doing</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </SelectContent>
      </Select>
      <Button
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
