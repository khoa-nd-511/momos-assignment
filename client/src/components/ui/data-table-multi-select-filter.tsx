import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ITag, NotionFilterProps } from "@/lib/types";
import { KeyboardEventHandler, useState } from "react";

type MultiSelectFilterProps<TData> = NotionFilterProps<TData, ITag[]> & {
  placeholder?: string;
};

const MultiSelectFilter = <TData,>({
  column,
  placeholder,
}: MultiSelectFilterProps<TData>) => {
  const [tags, setTags] = useState<string[]>([]);

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      const newTag = e.currentTarget.value.trim().toLowerCase();

      if (!newTag.length) return;

      if (tags.indexOf(newTag) >= 0) return;

      setTags([...tags, newTag]);
    }
  };

  const handleFilter = () => {
    column.setFilterValue(tags);
  };

  return (
    <div className="flex flex-col gap-2">
      <Input
        className="focus:ring-2"
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
      />
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge>{tag}</Badge>
        ))}
      </div>

      <Button onClick={handleFilter}>Filter</Button>
      <Button
        variant="ghost"
        onClick={() => {
          setTags([]);
          column.setFilterValue([]);
        }}
        disabled={!tags.length}
      >
        Clear filter
      </Button>
    </div>
  );
};

export default MultiSelectFilter;
