const assert = require('assert');
const calculateCommissionFees = require('../calculateCommissionFees'); // Replace this with your actual file name

// Test data for cash in transaction
const cashInTransaction = {
  type: 'cash_in',
  operation: {
    amount: 1000,
    currency: 'EUR',
  },
};

// Test data for cash out by natural person transaction
const cashOutNaturalTransaction = {
  type: 'cash_out',
  user_id: 1,
  user_type: 'natural',
  operation: {
    amount: 1000,
    currency: 'EUR',
  },
  user: {
    id: 1,
    type: 'natural',
    weekly_limit: {
      amount: 1000,
      currency: 'EUR',
    },
  },
};

// Test data for cash out by juridical person transaction
const cashOutJuridicalTransaction = {
  type: 'cash_out',
  user_id: 2,
  user_type: 'juridical',
  operation: {
    amount: 1000,
    currency: 'EUR',
  },
};

// Test case for cash in transaction
it('calculates the correct commission fee for cash in transaction', () => {
  const inputData = [cashInTransaction];
  const expectedOutput = ['0.30']; // 0.03% of 1000 is 0.30 EUR, which is less than the max fee of 5 EUR
  const actualOutput = calculateCommissionFees(inputData);
  assert.deepStrictEqual(actualOutput, expectedOutput);
});

// Test case for cash out by natural person transaction
it('calculates the correct commission fee for cash out by natural person transaction', () => {
  const inputData = [cashOutNaturalTransaction];
  const expectedOutput = ['0.00']; // No commission fee because the amount is less than the weekly limit
  const actualOutput = calculateCommissionFees(inputData);
  assert.deepStrictEqual(actualOutput, expectedOutput);
});

// Test case for cash out by juridical person transaction
it('calculates the correct commission fee for cash out by juridical person transaction', () => {
  const inputData = [cashOutJuridicalTransaction];
  const expectedOutput = ['3.00']; // 0.3% of 1000 is 3 EUR, which is more than the min fee of 0.5 EUR
  const actualOutput = calculateCommissionFees(inputData);
  assert.deepStrictEqual(actualOutput, expectedOutput);
});
