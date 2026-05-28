import type { StorybookConfig } from '@storybook/react-vite';

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';

const storybookDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(storybookDir, '../../..');

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  viteFinal: async (config) => {
    config.plugins = [
      ...(config.plugins ?? []),
      react(),
    ];

    config.resolve ??= {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@': path.resolve(workspaceRoot, 'apps/app-operator/src'),
      '@org/core': path.resolve(workspaceRoot, 'core/index.ts'),
    };

    return config;
  },
};

export default config;
