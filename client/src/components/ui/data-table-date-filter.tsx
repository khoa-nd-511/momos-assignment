import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotionFilterProps } from "@/lib/types";
import { Calendar } from "@/components/ui/calendar";

type DateFilterProps<TData> = NotionFilterProps<TData, string>;

type DateValue = {
  equals?: Date;
  before?: Date;
  after?: Date;
};

const DateFilter = <TData,>({
  fieldName,
  table,
  column,
}: DateFilterProps<TData>) => {
  const [date, setDate] = useState<Date | undefined>(() => {
    const initialValue = table
      .getColumn(fieldName)
      ?.getFilterValue() as DateValue;

    if (initialValue.equals) {
      return initialValue.equals;
    } else if (initialValue.before && initialValue.after) {
      // date range
      return undefined;
    } else if (!initialValue.after) {
      return initialValue.before;
    }

    return undefined;
  });
  const [option, setOption] = useState(() => {
    const initialValue = table
      .getColumn(fieldName)
      ?.getFilterValue() as DateValue;

    if (initialValue.equals) {
      return "equals";
    } else if (initialValue.before && initialValue.after) {
      // date range
      return "between";
    } else if (!initialValue.after) {
      return "before";
    } else {
      return "after";
    }
  });

  const handleOptionChange = (value: string) => {
    setOption(value);
  };

  const handleFilter = () => {
    if (option === "isBetween") {
      return;
    }

    column.setFilterValue({
      [option]: date,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Select value={option} onValueChange={handleOptionChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Filter Options</SelectLabel>
            <SelectItem value="equals">Is</SelectItem>
            <SelectItem value="before">Is Before</SelectItem>
            <SelectItem value="after">Is After</SelectItem>
            <SelectItem value="between">Is Between</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </PopoverContent>
      </Popover>

      <Button onClick={handleFilter}>Filter</Button>
      <Button variant="ghost" onClick={() => column.setFilterValue(undefined)}>
        Clear filter
      </Button>
    </div>
  );
};

export default DateFilter;
