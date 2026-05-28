export type DonutSegmentPattern = 'solid' | 'hatched';

export interface DonutChartSegment {
  id: string;
  value: number;
  color: string;
  pattern?: DonutSegmentPattern;
}

export interface DonutChartLegendItem {
  id: string;
  label: string;
  value: number;
  color: string;
  pattern?: DonutSegmentPattern;
}

/** Стили обёртки DonutChartCard; `false` — без карточки */
export interface DonutChartCardStyle {
  background?: string;
  borderRadius?: string;
  padding?: string;
}

export interface DonutChartProps {
  title: string;
  chartData: DonutChartSegment[];
  legendData: DonutChartLegendItem[];
  cardStyle?: DonutChartCardStyle | false;
  /** Клик по пункту легенды (фильтр, другое действие) */
  onLegendItemClick?: (item: DonutChartLegendItem) => void;
  /** Подсветка выбранного пункта легенды */
  activeLegendId?: string | null;
}

/** Данные для одного бублика (ответ API / слайс) */
export type DonutChartData = Pick<
  DonutChartProps,
  'title' | 'chartData' | 'legendData' | 'cardStyle'
>;
