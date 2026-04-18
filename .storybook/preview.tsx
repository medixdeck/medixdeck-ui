import type { Preview } from "@storybook/react";
import React from "react";
import { MedixProvider } from "../lib/components/provider/MedixProvider";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <MedixProvider>
        <Story />
      </MedixProvider>
    ),
  ],
};

export default preview;
