import React from 'react';

import type { Preview } from '@storybook/react';

import '../src/styles.css';
import { ThemeProvider } from '../src/ThemeSwitcher';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0a0a0a',
        },
      ],
    },
  },
  decorators: [
    Story => (
      <ThemeProvider defaultTheme="light">
        <div className="bg-background text-foreground min-h-screen">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default preview;
