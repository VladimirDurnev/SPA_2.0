export const incidentsRu = {
  page: {
    title: 'Текущие инциденты',
  },
  table: {
    title: 'Список инцидентов',
    columns: {
      name: 'Название ЦМ',
      cmState: 'Состояние ЦМ',
      criticality: 'Критичность инцидента',
      incidentState: 'Состояние инцидента',
      malfunction: 'Предполагаемая неисправность',
      deadline: 'Срок устранения',
      durationDays: 'Продолжительность, дней',
      totalIncidents: 'Инцидентов всего',
      assigned: 'Назначено',
    },
  },
  charts: {
    criticality: {
      title: 'Критичность инцидента',
      high: 'Высокая',
      medium: 'Средняя',
      low: 'Низкая',
      unspecified: 'Не указана',
    },
    incidentState: {
      title: 'Состояния инцидента',
      model: 'Модель',
      equipment: 'Оборудование',
      sensor: 'Проблема датчика',
    },
    duration: {
      title: 'Продолжительность инцидента',
      lessWeek: 'Менее недели',
      weeks12: '1-2 нед.',
      weeks35: '3-5',
      weeks68: '6-8',
      more8: 'Более 8 нед.',
    },
  },
  criticality: {
    high: 'Высокая',
    medium: 'Средняя',
    low: 'Низкая',
  },
  incidentState: {
    model: 'Модель',
    equipment: 'Оборудование',
    sensor: 'Проблема датчика',
  },
  a11y: {
    cmStateActive: 'Активное состояние',
    rowActions: 'Действия',
  },
  errors: {
    loadFailed: 'Не удалось загрузить инциденты',
    filterFailed: 'Не удалось отфильтровать инциденты',
    loadFallback: 'Ошибка загрузки',
    filterFallback: 'Ошибка фильтрации',
  },
} as const;
