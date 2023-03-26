const cashInConfig = { percents: 0.03, max: { amount: 5, currency: 'EUR' } };
const cashOutNaturalConfig = {
  percents: 0.3,
  week_limit: { amount: 1000, currency: 'EUR' },
};
const cashOutJuridicalConfig = {
  percents: 0.3,
  min: { amount: 0.5, currency: 'EUR' },
};

// Helper function to calculate commission fee for cash in operation
function calculateCashInFee(operation) {
  const fee = (operation.amount * cashInConfig.percents) / 100;
  return Math.min(fee, cashInConfig.max.amount);
}

// Helper function to calculate commission fee for cash out operation by natural person
function calculateCashOutNaturalFee(operation, state) {
  const { weeklyAmount } = { ...state };
  const amountLeft = cashOutNaturalConfig.week_limit.amount - weeklyAmount;
  const amountExceeded = Math.max(operation.amount - amountLeft, 0);
  const updatedFee = (amountExceeded * cashOutNaturalConfig.percents) / 100;
  const newWeeklyAmount = weeklyAmount + Math.min(operation.amount, amountLeft);
  return { updatedFee, updatedWeeklyAmount: newWeeklyAmount };
}

// Helper function to calculate commission fee for cash out operation by juridical person
function calculateCashOutJuridicalFee(operation) {
  const fee = (operation.amount * cashOutJuridicalConfig.percents) / 100;
  return Math.max(fee, cashOutJuridicalConfig.min.amount);
}

module.exports = {
  calculateCashInFee,
  calculateCashOutNaturalFee,
  calculateCashOutJuridicalFee,
};
