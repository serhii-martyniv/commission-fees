import assert from 'assert';
import calculateCommissionFees from '../calculateCommissionFees.mjs';

const config = {
  cashInConfig: { percents: 0.03, max: { amount: 5, currency: 'EUR' } },
  cashOutNaturalConfig: { percents: 0.3, week_limit: { amount: 1000, currency: 'EUR' } },
  cashOutJuridicalConfig: { percents: 0.3, min: { amount: 0.5, currency: 'EUR' } },
};

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
  const actualOutput = calculateCommissionFees(inputData, config);
  assert.deepStrictEqual(actualOutput, expectedOutput);
});

// Test case for cash out by natural person transaction
it('calculates the correct commission fee for cash out by natural person transaction', () => {
  const inputData = [cashOutNaturalTransaction];
  const expectedOutput = ['0.00']; // No commission fee because the amount is less than the weekly limit
  const actualOutput = calculateCommissionFees(inputData, config);
  assert.deepStrictEqual(actualOutput, expectedOutput);
});

// Test case for cash out by juridical person transaction
it('calculates the correct commission fee for cash out by juridical person transaction', () => {
  const inputData = [cashOutJuridicalTransaction];
  const expectedOutput = ['3.00']; // 0.3% of 1000 is 3 EUR, which is more than the min fee of 0.5 EUR
  const actualOutput = calculateCommissionFees(inputData, config);
  assert.deepStrictEqual(actualOutput, expectedOutput);
});

// Test case for negative transaction amount
it('throws an error for negative transaction amount', () => {
  const inputData = [{ type: 'cash_in', operation: { amount: -1, currency: 'EUR' } }];
  assert.throws(() => calculateCommissionFees(inputData, config), Error);
});

/*
  Test case where the transaction amount is equal to
  the maximum amount for a cash-out transaction (1000000 EUR)
*/
it('calculates the correct commission fee when transaction amount is equal to the maximum amount for a cash-out transaction', () => {
  const inputData = [
    {
      type: 'cash_out',
      user_id: 2,
      user_type: 'juridical',
      operation: {
        amount: 1000000,
        currency: 'EUR',
      },
    },
  ];
  const expectedOutput = ['3000.00'];
  const actualOutput = calculateCommissionFees(inputData, config);
  assert.deepStrictEqual(actualOutput, expectedOutput);
});

/*
  Test case where the transaction amount is equal to
  the minimum amount for a juridical person (0.5 EUR)
*/
it('calculates the correct commission fee when transaction amount is equal to the minimum amount for a juridical person', () => {
  const inputData = [
    {
      type: 'cash_out',
      user_id: 2,
      user_type: 'juridical',
      operation: {
        amount: 0.5,
        currency: 'EUR',
      },
    },
  ];
  const expectedOutput = ['0.50'];
  const actualOutput = calculateCommissionFees(inputData, config);
  assert.deepStrictEqual(actualOutput, expectedOutput);
});

/*
  Test case where the transaction amount is less than the
  minimum amount for a juridical person (0.5 EUR)
*/
it('calculates the correct commission fee when transaction amount is less than the minimum amount for a juridical person', () => {
  const inputData = [
    {
      type: 'cash_out',
      user_id: 2,
      user_type: 'juridical',
      operation: {
        amount: 0.49,
        currency: 'EUR',
      },
    },
  ];
  const expectedOutput = ['0.50'];
  const actualOutput = calculateCommissionFees(inputData, config);
  assert.deepStrictEqual(actualOutput, expectedOutput);
});
