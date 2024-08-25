import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotionFilterProps } from "@/lib/types";

const NumberFilter = <TData,>({
  fieldName,
  table,
  column,
}: NotionFilterProps<TData, number>) => {
  const [value, setValue] = useState<string | undefined>(
    String(table.getColumn(fieldName)?.getFilterValue()) || undefined
  );

  return (
    <div className="flex flex-col gap-2">
      <Input
        type="number"
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            table.getColumn(fieldName)?.setFilterValue(value);
          }
        }}
      />

      <Button
        variant="ghost"
        onClick={() => {
          column.setFilterValue("");
          setValue(undefined);
        }}
        disabled={!value}
      >
        Clear filter
      </Button>
    </div>
  );
};

export default NumberFilter;
