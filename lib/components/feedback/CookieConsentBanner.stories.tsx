import type { Meta, StoryObj } from '@storybook/react';
import { CookieConsentBanner } from './CookieConsentBanner';

const meta: Meta<typeof CookieConsentBanner> = {
  title: 'Feedback/CookieConsentBanner',
  component: CookieConsentBanner,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A customizable GDPR/NDPR compliant cookie consent banner powered by `react-cookie-consent` and styled with the MedixDeck design system.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CookieConsentBanner>;

export const Default: Story = {
  args: {},
};

export const CustomCopy: Story = {
  args: {
    title: 'Privacy & Cookies',
    acceptText: 'Accept',
    declineText: 'Decline',
    children: 'We use cookies to ensure you get the best experience on our website.',
  },
};

export const WithoutDeclineButton: Story = {
  args: {
    enableDeclineButton: false,
  },
};
