import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotionFilterProps } from "@/lib/types";

const RichTextFilter = <TData,>({
  fieldName,
  table,
  column,
}: NotionFilterProps<TData, string>) => {
  const [value, setValue] = useState(
    (table.getColumn(fieldName)?.getFilterValue() || "") as string
  );

  return (
    <div className="flex flex-col gap-2">
      <Input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            table.getColumn(fieldName)?.setFilterValue(value.trim());
          }
        }}
      />

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

export default RichTextFilter;
