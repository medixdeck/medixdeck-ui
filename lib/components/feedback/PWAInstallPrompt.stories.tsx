import type { Meta, StoryObj } from "@storybook/react";
import { PWAInstallPrompt } from "./PWAInstallPrompt";
import { Logo } from "../primitive/Logo";

const meta: Meta<typeof PWAInstallPrompt> = {
  title: "Feedback/PWAInstallPrompt",
  component: PWAInstallPrompt,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A cross-platform PWA install nudge. On Android/Chromium it captures `beforeinstallprompt` and triggers the native dialog. On iOS Safari it shows step-by-step \"Add to Home Screen\" instructions. Dismissals are persisted with a configurable cooldown.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PWAInstallPrompt>;

export const Default: Story = {
  args: {
    forceVisible: true,
    title: "Install MedixDeck",
    description:
      "Add MedixDeck to your home screen for faster access and a better healthcare experience.",
    appName: "MedixDeck",
  },
};

export const WithCustomIcon: Story = {
  args: {
    forceVisible: true,
    title: "Install MedixDeck",
    description: "Get faster access and offline support.",
    appName: "MedixDeck",
    icon: <Logo type="icon" height={48} />,
  },
};

export const TopPosition: Story = {
  args: {
    forceVisible: true,
    title: "Install MedixDeck",
    description: "Pin MedixDeck to your device for one-tap access.",
    position: "top",
    appName: "MedixDeck",
  },
};

export const IOSVariant: Story = {
  args: {
    forceVisible: true,
    forceIOS: true,
    title: "Install MedixDeck",
    description: "Add MedixDeck to your home screen for faster access and a better healthcare experience.",
    appName: "MedixDeck",
  },
};
