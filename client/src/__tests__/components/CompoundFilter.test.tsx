import { render } from "@/test-utils";

import CompoundFilter from "@/components/CompoundFilter";

describe("CompoundFilter", () => {
  test("should render properly", () => {
    const { debug } = render(<CompoundFilter />);

    debug();
  });
});
