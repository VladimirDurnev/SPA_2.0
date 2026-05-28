import type { Preview } from '@storybook/react-vite';

import React from 'react';
import { StorybookProviders } from '../src/StorybookProviders';

import 'antd/dist/reset.css';

const preview: Preview = {
  decorators: [
    Story => (
      <StorybookProviders>
        <Story />
      </StorybookProviders>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'fullscreen',
  },
};

export default preview;
