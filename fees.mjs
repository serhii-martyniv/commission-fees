import { getWeekNumber } from './utils.mjs';

// Helper function to calculate commission fee for cash in operation
export function calculateCashInFee(operation, config) {
  const fee = (operation.amount * config.percents) / 100;
  return Math.min(fee, config.max.amount);
}

// Helper function to calculate commission fee for cash out operation by natural person
export function calculateCashOutNaturalFee(operation, state, date, config) {
  const amountLeft = config.week_limit.amount - state.weeklyAmount;
  const amountExceeded = Math.max(operation.amount - amountLeft, 0);

  // Check if transaction belongs to a new week
  const currentDate = new Date(date);
  const currentWeek = getWeekNumber(currentDate);
  const currentYear = currentDate.getFullYear();
  const lastWeek = state.weekNumber;
  const lastYear = state.year;
  const newState = { ...state };

  if (currentYear !== lastYear || currentWeek !== lastWeek) {
    newState.weeklyAmount = 0;
    newState.weekNumber = currentWeek;
    newState.year = currentYear;
  }

  newState.weeklyAmount += Math.min(operation.amount, amountLeft);
  const fee = amountExceeded * (config.percents / 100);
  return { fee, state: newState };
}

// Helper function to calculate commission fee for cash out operation by juridical person
export function calculateCashOutJuridicalFee(operation, config) {
  const fee = (operation.amount * config.percents) / 100;
  return Math.max(fee, config.min.amount);
}
