const {
  calculateCashInFee,
  calculateCashOutNaturalFee,
  calculateCashOutJuridicalFee,
} = require('./fees');

function calculateCommissionFees(inputData) {
  // State object to keep track of weekly amounts for each user
  const state = {};

  return inputData.map((transaction) => {
    const { operation } = transaction;
    let fee = 0;

    switch (transaction.type) {
      case 'cash_in':
        fee = calculateCashInFee(operation);
        break;
      case 'cash_out':
        if (transaction.user_type === 'natural') {
          const userId = transaction.user_id;
          const userState = state[userId] || { weeklyAmount: 0 };
          const {
            updatedFee,
            updatedWeeklyAmount,
          } = calculateCashOutNaturalFee(operation, state[userId] || { weeklyAmount: 0 });
          fee = updatedFee;
          userState.weeklyAmount = updatedWeeklyAmount;
          state[userId] = userState;
        } else if (transaction.user_type === 'juridical') {
          fee = calculateCashOutJuridicalFee(operation);
        }
        break;
      default:
        throw new Error(`Unknown transaction type: ${transaction.type}`);
    }

    // Round fee to 2 decimal places and output as string without currency
    fee = Math.ceil(fee * 100) / 100;
    return fee.toFixed(2);
  });
}

module.exports = calculateCommissionFees;
