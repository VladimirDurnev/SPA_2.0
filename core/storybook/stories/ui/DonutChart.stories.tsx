import type { DonutChartProps } from '@org/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { DonutChart } from '@org/core';

const meta = {
  title: 'UI/Charts/DonutChart',
  component: DonutChart,
  args: {
    title: 'Критичность инцидента',
    chartData: [
      { id: 'high', value: 12, color: '#d9363e' },
      { id: 'medium', value: 24, color: '#fa8c16' },
      { id: 'low', value: 16, color: '#52c41a', pattern: 'hatched' },
    ],
    legendData: [
      { id: 'high', label: 'Высокая', value: 12, color: '#d9363e' },
      { id: 'medium', label: 'Средняя', value: 24, color: '#fa8c16' },
      { id: 'low', label: 'Низкая', value: 16, color: '#52c41a', pattern: 'hatched' },
    ],
  },
} satisfies Meta<typeof DonutChart>;

export default meta;

type Story = StoryObj<DonutChartProps>;

export const Default: Story = {};
