import { ReactNode } from "react";
import { render, RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AllTheProviders } from "@/test-providers";

const customRender = (ui: ReactNode, options: RenderOptions = {}) => ({
  user: userEvent.setup(),
  ...render(ui, { wrapper: AllTheProviders, ...options }),
});

export * from "@testing-library/react";

export { customRender as render };
