import fetchConfigData from './api/fetchConfigData.mjs';

// Helper function to get configs object
export async function getConfig() {
  const cashInConfig = await fetchConfigData('https://developers.paysera.com/tasks/api/cash-in');
  const cashOutNaturalConfig = await fetchConfigData('https://developers.paysera.com/tasks/api/cash-out-natural');
  const cashOutJuridicalConfig = await fetchConfigData('https://developers.paysera.com/tasks/api/cash-out-juridical');

  return { cashInConfig, cashOutNaturalConfig, cashOutJuridicalConfig };
}

// Helper function to get the week number from a Date object
export function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
