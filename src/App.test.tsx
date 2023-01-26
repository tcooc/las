import { render, screen } from "@testing-library/react";
import { App } from "./App";

test("renders header", () => {
  render(<App />);
  const header = screen.getByText("");
  expect(header).toBeInTheDocument();
});
