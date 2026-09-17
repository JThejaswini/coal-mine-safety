export const riskRules = {
  'No Helmet': 'High',
  'No Gloves': 'Medium',
  'No Goggles': 'Medium',
  'Unsafe Equipment': 'High',
  'Dust Threshold Exceeded': 'Medium',
}
export function getRiskLevel(violationType) {
  return riskRules[violationType] || 'Low'
}