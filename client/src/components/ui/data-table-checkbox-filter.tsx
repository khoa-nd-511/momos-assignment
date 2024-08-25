import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { NotionFilterProps } from "@/lib/types";

const CheckboxFilter = <TData,>({
  fieldName,
  table,
  column,
}: NotionFilterProps<TData, boolean>) => {
  const [value, setValue] = useState(
    (table.getColumn(fieldName)?.getFilterValue() || "") as string
  );

  return (
    <div className="flex flex-col gap-2">
      <RadioGroup
        value={value}
        onValueChange={(value) => {
          table.getColumn(fieldName)?.setFilterValue(value);
          setValue(value);
        }}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="true" id="r2" />
          <Label htmlFor="r2">Completed</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="r3" />
          <Label htmlFor="r3">Not Completed</Label>
        </div>
      </RadioGroup>
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

export default CheckboxFilter;
