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
import { DateRange } from "react-day-picker";

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
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const initialValue = table
      .getColumn(fieldName)
      ?.getFilterValue() as DateValue;

    if (initialValue && initialValue.before && initialValue.after) {
      return {
        from: initialValue.after,
        to: initialValue.before,
      };
    }

    return undefined;
  });
  const [date, setDate] = useState<Date | undefined>(() => {
    const initialValue = table
      .getColumn(fieldName)
      ?.getFilterValue() as DateValue;

    if (!initialValue) return undefined;

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

    if (!initialValue) return "equals";

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
    if (option === "between") {
      column.setFilterValue({
        after: dateRange?.from,
        before: dateRange?.to,
      });
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
            {option === "between" ? null : date ? (
              format(date, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
            {option === "between" ? (
              dateRange?.from && dateRange.to ? (
                `${format(dateRange.from, "yyy/M/d")} - ${format(
                  dateRange.to,
                  "yyy/M/d"
                )}`
              ) : (
                <span>Pick a date</span>
              )
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          {option === "between" ? (
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
            />
          ) : (
            <Calendar mode="single" selected={date} onSelect={setDate} />
          )}
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
