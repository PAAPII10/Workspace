import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async config => {
    // Add Tailwind CSS support
    const { mergeConfig } = await import('vite');
    return mergeConfig(config, {
      css: {
        postcss: {
          plugins: [require('tailwindcss'), require('autoprefixer')],
        },
      },
    });
  },
};

export default config;
