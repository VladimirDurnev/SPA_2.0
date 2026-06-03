export const incidentsEn = {
  page: {
    title: 'Current incidents',
  },
  table: {
    title: 'Incidents list',
    columns: {
      name: 'Asset name',
      cmState: 'CM state',
      criticality: 'Incident criticality',
      incidentState: 'Incident state',
      malfunction: 'Suspected malfunction',
      deadline: 'Resolution deadline',
      durationDays: 'Duration, days',
      totalIncidents: 'Total incidents',
      assigned: 'Assigned',
    },
  },
  charts: {
    criticality: {
      title: 'Incident criticality',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      unspecified: 'Unspecified',
    },
    incidentState: {
      title: 'Incident states',
      model: 'Model',
      equipment: 'Equipment',
      sensor: 'Sensor issue',
    },
    duration: {
      title: 'Incident duration',
      lessWeek: 'Less than a week',
      weeks12: '1-2 weeks',
      weeks35: '3-5 weeks',
      weeks68: '6-8 weeks',
      more8: 'More than 8 weeks',
    },
  },
  criticality: {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  },
  incidentState: {
    model: 'Model',
    equipment: 'Equipment',
    sensor: 'Sensor issue',
  },
  a11y: {
    cmStateActive: 'Active state',
    rowActions: 'Actions',
  },
  errors: {
    loadFailed: 'Failed to load incidents',
    filterFailed: 'Failed to filter incidents',
    invalidResponse: 'API returned data in an unexpected format',
    loadFallback: 'Load error',
    filterFallback: 'Filter error',
    notificationTitle: 'Incidents error',
  },
} as const;
