import {
  calculateCashInFee,
  calculateCashOutNaturalFee,
  calculateCashOutJuridicalFee,
} from './fees.mjs';

function calculateCommissionFees(inputData, config) {
  // State object to keep track of weekly amounts for each user
  const state = {};
  const {
    cashInConfig,
    cashOutNaturalConfig,
    cashOutJuridicalConfig,
  } = config;

  return inputData.map((transaction) => {
    const {
      operation,
      user_id: userId,
      user_type: userType,
      type,
      date,
    } = transaction;

    let fee = 0;
    let userState;

    if (operation.amount < 0) {
      throw new Error('Transaction amount cannot be less than 0');
    }

    switch (type) {
      case 'cash_in':
        fee = calculateCashInFee(operation, cashInConfig);
        break;
      case 'cash_out':
        if (userType === 'natural') {
          userState = state[userId] || { weeklyAmount: 0, weekNumber: 0, year: 0 };
          const {
            fee: updatedFee,
            state: updatedState,
          } = calculateCashOutNaturalFee(operation, userState, date, cashOutNaturalConfig);
          fee = updatedFee;
          userState = updatedState;
          state[userId] = userState;
        } else if (userType === 'juridical') {
          fee = calculateCashOutJuridicalFee(operation, cashOutJuridicalConfig);
        }
        break;
      default:
        throw new Error(`Unknown transaction type: ${type}`);
    }

    // Round fee to 2 decimal places and output as string without currency
    fee = Math.ceil(fee * 100) / 100;
    return fee.toFixed(2);
  });
}

export default calculateCommissionFees;
