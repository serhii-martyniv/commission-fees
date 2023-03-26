const fs = require('fs');
const calculateCommissionFees = require('./calculateCommissionFees');

// Load input data from file
const inputFilePath = process.argv[2];
const inputData = JSON.parse(fs.readFileSync(inputFilePath));

// Output commission fees to stdout
const commissionFees = calculateCommissionFees(inputData);
/* eslint-disable no-console */
commissionFees.forEach((fee) => console.log(fee));
