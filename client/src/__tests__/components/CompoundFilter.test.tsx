import { render, screen } from "@/test-utils";

import CompoundFilter from "@/components/CompoundFilter";

describe("CompoundFilter", () => {
  test("should render empty compound filter", async () => {
    render(<CompoundFilter />);

    expect(screen.getByText(/compound filter/i)).toBeInTheDocument();

    const addBtn = screen.getByRole("button", { name: /add rule/i });
    expect(addBtn).toBeInTheDocument();
  });

  test("should render filters correctly", async () => {
    render(
      <CompoundFilter
        compoundFilter={{
          and: [
            { property: "name", rich_text: { contains: "ui design" } },
            { property: "estimation", number: { less_than: 3 } },
            { property: "completed", checkbox: { equals: false } },
          ],
        }}
      />
    );

    expect(screen.getByDisplayValue("Name")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Contains")).toBeInTheDocument();
    expect(screen.getByDisplayValue("ui design")).toBeInTheDocument();

    expect(screen.getByDisplayValue("Estimation")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Less Than")).toBeInTheDocument();
    expect(screen.getByDisplayValue(3)).toBeInTheDocument();

    expect(screen.getByDisplayValue("Completed")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Equals")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Not Completed")).toBeInTheDocument();
  });

  test("should render filters with group correctly", async () => {
    render(
      <CompoundFilter
        compoundFilter={{
          and: [
            { property: "name", rich_text: { contains: "ui" } },
            { property: "name", rich_text: { contains: "design" } },
            {
              or: [
                {
                  property: "estimation",
                  number: { less_than: 5 },
                },
                {
                  and: [{ property: "completed", checkbox: { equals: false } }],
                },
              ],
            },
          ],
        }}
      />
    );

    screen.getAllByDisplayValue("Name").forEach((el) => {
      expect(el).toBeInTheDocument();
    });
    screen.getAllByDisplayValue("Contains").forEach((el) => {
      expect(el).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue("ui")).toBeInTheDocument();
    expect(screen.getByDisplayValue("design")).toBeInTheDocument();

    expect(screen.getByDisplayValue("OR")).toBeInTheDocument();

    expect(screen.getByDisplayValue("Estimation")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Less Than")).toBeInTheDocument();
    expect(screen.getByDisplayValue(5)).toBeInTheDocument();

    expect(screen.getByDisplayValue("AND")).toBeInTheDocument();

    expect(screen.getByDisplayValue("Completed")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Equals")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Not Completed")).toBeInTheDocument();
  });
});
