export const dashboardData = {
  inspections: 128,
  openViolations: 17,
  highRiskIssues: 4,
  pendingActions: 12,
  compliance: 87,

  riskDistribution: {
    critical: 2,
    high: 4,
    medium: 6,
    low: 5,
  },

  violationsByZone: [
    { zone: 'Zone A', count: 4 },
    { zone: 'Zone B', count: 8 },
    { zone: 'Zone C', count: 3 },
    { zone: 'Zone D', count: 2 },
  ],

  alerts: [
    {
      id: 1,
      type: 'Safety',
      message: 'No helmet detected at Entry Checkpoint',
      severity: 'High',
      time: '10 min ago',
    },
    {
      id: 2,
      type: 'Environment',
      message: 'Dust level exceeded threshold in Zone B',
      severity: 'Medium',
      time: '32 min ago',
    },
    {
      id: 3,
      type: 'Compliance',
      message: 'Equipment certificate is overdue',
      severity: 'High',
      time: '1 hour ago',
    },
  ],

  correctiveActions: [
    {
      id: 'CA-1024',
      issue: 'PPE violation',
      zone: 'Zone A',
      assignedTo: 'Safety Officer',
      deadline: '12 Sep 2026',
    },
    {
      id: 'CA-1021',
      issue: 'Unsafe equipment',
      zone: 'Zone C',
      assignedTo: 'Field Officer',
      deadline: '13 Sep 2026',
    },
    {
      id: 'CA-1018',
      issue: 'Dust threshold exceeded',
      zone: 'Zone B',
      assignedTo: 'Environment Officer',
      deadline: '14 Sep 2026',
    },
  ],
}