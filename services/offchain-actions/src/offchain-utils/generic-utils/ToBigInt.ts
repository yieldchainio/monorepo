/**
 * @dev
 * @param {string | number | bigint} value
 * @returns {bigint}
 * Function to convert a string/number to a bigint, even if it has a decimal point.
 */
const toBigInt = (value: string | number | bigint): bigint => {
  // If it's already a bigint, return it.
  if (typeof value === "bigint") return value;

  let ourNumber: string | number;
  try {
    // If it's not a string, convert it to a string.
    ourNumber = typeof value === "string" ? value : value.toString();

    // The "Whole Number" is the part before the decimal point.
    let wholeNumber = ourNumber.split(".")[0];

    // The "Decimal Number" is the part after the decimal point.
    let decimalNumber = ourNumber.split(".")[1];

    // If there is a decimal number, round up or down based on the first digit after the decimal point.
    if (decimalNumber) {
      let roundUpOrDown = parseInt(decimalNumber[0]) <= parseInt("5") ? 0 : 1;

      // Return the whole number + the rounded up or down decimal number.
      return BigInt(wholeNumber) + BigInt(roundUpOrDown);
    } else return BigInt(wholeNumber); // If there is no decimal number, just return the whole number.
  } catch (e: any) {
    // If there is an error, throw an error (i.e when a non-number is passed in)
    throw new Error(`Error in toBigInt: ${e.message}`);
  }
};

export default toBigInt;
