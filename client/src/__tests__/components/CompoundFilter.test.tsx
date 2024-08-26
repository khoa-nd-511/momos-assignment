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

  test("should handle adding, editing submitting rule", async () => {
    const handleFilterChange = jest.fn();
    const { user } = render(<CompoundFilter onChange={handleFilterChange} />);

    expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: /add rule/i }));

    await user.click(screen.getByText(/add filter rule/i));

    expect(screen.getByRole("button", { name: /submit/i })).toBeEnabled();

    expect(screen.getByDisplayValue("Name")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Equals")).toBeInTheDocument();

    await user.type(
      screen.getByPlaceholderText(/enter task name.../i),
      "design"
    );

    expect(screen.getByDisplayValue("design")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(handleFilterChange).toHaveBeenCalledTimes(1);
    expect(handleFilterChange).toHaveBeenCalledWith({
      and: [{ property: "name", rich_text: { equals: "design" } }],
    });
  });

  test("should handle remove rule", async () => {
    const { user } = render(
      <CompoundFilter
        compoundFilter={{
          and: [{ property: "name", rich_text: { contains: "ui" } }],
        }}
      />
    );

    expect(screen.getByText(/submit/i)).toBeEnabled();

    expect(screen.getByDisplayValue("Name")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Contains")).toBeInTheDocument();
    expect(screen.getByDisplayValue("ui")).toBeInTheDocument();

    await user.click(screen.getByLabelText("remove filters.0"));

    expect(screen.getByText(/submit/i)).toBeDisabled();
  });

  test("should handle remove filter group", async () => {
    const { user } = render(
      <CompoundFilter
        compoundFilter={{
          and: [
            {
              or: [
                { property: "name", rich_text: { contains: "ui" } },
                { property: "name", rich_text: { contains: "design" } },
              ],
            },
          ],
        }}
      />
    );

    expect(screen.getByText(/submit/i)).toBeEnabled();

    expect(screen.getAllByDisplayValue("Name")).toHaveLength(2);
    expect(screen.getAllByDisplayValue("Contains")).toHaveLength(2);
    expect(screen.getByDisplayValue("design")).toBeInTheDocument();
    expect(screen.getByDisplayValue("ui")).toBeInTheDocument();

    await user.click(screen.getByText(/remove group/i));

    expect(screen.getByText(/submit/i)).toBeDisabled();
  });

  test("should be able to submit if there is filter after remove", async () => {
    const handleFilterChange = jest.fn();
    const { user } = render(
      <CompoundFilter
        onChange={handleFilterChange}
        compoundFilter={{
          and: [
            {
              or: [
                { property: "name", rich_text: { contains: "ui" } },
                { property: "name", rich_text: { contains: "design" } },
              ],
            },
          ],
        }}
      />
    );

    expect(screen.getByText(/submit/i)).toBeEnabled();

    expect(screen.getAllByDisplayValue("Name")).toHaveLength(2);
    expect(screen.getAllByDisplayValue("Contains")).toHaveLength(2);
    expect(screen.getByDisplayValue("design")).toBeInTheDocument();
    expect(screen.getByDisplayValue("ui")).toBeInTheDocument();

    await user.click(screen.getByLabelText("remove filters.0.filters.1"));

    expect(screen.getAllByDisplayValue("Name")).toHaveLength(1);
    expect(screen.getAllByDisplayValue("Contains")).toHaveLength(1);
    expect(screen.getByDisplayValue("ui")).toBeInTheDocument();

    expect(screen.getByText(/submit/i)).toBeEnabled();

    await user.click(screen.getByText(/submit/i));

    expect(handleFilterChange).toHaveBeenCalledTimes(1);
    expect(handleFilterChange).toHaveBeenCalledWith({
      and: [{ or: [{ property: "name", rich_text: { contains: "ui" } }] }],
    });
  });
});
