import type { Meta, StoryObj } from "@storybook/react";
import { ServerErrorPage } from "./ServerErrorPage";

const meta: Meta<typeof ServerErrorPage> = {
  title: "Feedback/ServerErrorPage",
  component: ServerErrorPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ServerErrorPage>;

export const Default: Story = {
  args: {
    onAction: () => console.log("Try again clicked"),
  },
};

export const WithErrorMessage: Story = {
  args: {
    title: "System Maintenance",
    description: "Our servers are currently undergoing scheduled maintenance. We'll be back shortly.",
    errorMessage: "Maintenance ID: MAINT-9921-X3",
    actionLabel: "Refresh Page",
    onAction: () => window.location.reload(),
  },
};

export const CriticalError: Story = {
  args: {
    title: "Critical Database Error",
    description: "We are having trouble connecting to our database. Our engineers have been notified.",
    errorMessage: "Error Code: DB_CONN_TIMEOUT_NODE_04",
    actionLabel: "Try Again",
    secondaryLabel: "System Status",
    onAction: () => console.log("Try again clicked"),
    onSecondaryAction: () => window.open("https://status.medixdeck.com", "_blank"),
  },
};
