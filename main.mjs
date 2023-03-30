import { readFileSync } from 'fs';
import calculateCommissionFees from './calculateCommissionFees.mjs';
import { getConfig } from './utils.mjs';

let config = {};

async function initConfig() {
  config = await getConfig();
}

initConfig();

// Load input data from file
const inputFilePath = process.argv[2];
const inputData = JSON.parse(readFileSync(inputFilePath));

// Output commission fees to stdout
setTimeout(() => {
  const commissionFees = calculateCommissionFees(inputData, config);
  /* eslint-disable no-console */
  commissionFees.forEach((fee) => console.log(fee));
}, 3000);
