import type { IncidentTreeNode } from '@/modules/incidents/types';

export const incidentsTreeMock: IncidentTreeNode[] = [
  {
    id: 'cm-1',
    name: 'ЦМ-01. Турбоагрегат',
    cmState: 'active',
    totalIncidents: 7,
    children: [
      {
        id: 'incident-1',
        name: 'Рост вибрации на подшипнике',
        criticality: 'high',
        incidentState: 'equipment',
        malfunction: 'Дисбаланс',
        deadline: '2026-06-02',
        durationDays: 9,
        assigned: 'Иванов И.И.',
      },
      {
        id: 'incident-2',
        name: 'Дрейф показаний датчика',
        criticality: 'medium',
        incidentState: 'sensor',
        malfunction: 'Проблема датчика',
        deadline: '2026-06-05',
        durationDays: 4,
        assigned: 'Петров П.П.',
      },
    ],
  },
  {
    id: 'cm-2',
    name: 'ЦМ-02. Насосная группа',
    cmState: 'active',
    totalIncidents: 3,
    children: [
      {
        id: 'incident-3',
        name: 'Отклонение модели прогноза',
        criticality: 'low',
        incidentState: 'model',
        malfunction: 'Порог модели',
        deadline: '2026-06-10',
        durationDays: 2,
        assigned: 'Сидоров С.С.',
      },
    ],
  },
];
