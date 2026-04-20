import { ReactElement } from "react";
import { render as rtlRender, screen, fireEvent, RenderOptions } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";
import { MedixProvider } from "../provider/MedixProvider";

const render = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  rtlRender(ui, { wrapper: MedixProvider, ...options });

describe("Button Component", () => {
  it("renders the button with text", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByText("Click Me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when isDisabled prop is true", () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByText("Disabled Button").closest("button");
    expect(button).toBeDisabled();
  });
});
