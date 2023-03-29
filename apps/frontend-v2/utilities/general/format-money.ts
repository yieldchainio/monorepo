/**
 * Format an amount of money,
 * e.g input 1000000 - get $1M
 * @param value - The value to format
 */
export const formatMoney = (
  value: number,
  currency: "$" | "₪" = "$"
): string => {
  const stringified = value.toString().split(".")[0];

  if (
    stringified.length == 1 ||
    stringified.length == 2 ||
    stringified.length == 3
  )
    return `$${value.toFixed(2)}`;
  else if (stringified.length == 4) {
    const thousandsString = value.toFixed(0).toString().split("");
    thousandsString.splice(1, 0, ",");
    return `$${thousandsString.join("")}`;
  } else {
    try {
      const base = value.toFixed(0).toString();
      if (stringified.length === 5) return `$${base.slice(0, 2)}K`;
      if (stringified.length === 6) return `$${base.slice(0, 3)}K`;
      if (stringified.length === 7) return `$${base[0]}M`;
      if (stringified.length === 8) return `$${base.slice(0, 1)}M`;
      if (stringified.length === 9) return `$${base.slice(0, 2)}M`;
      if (stringified.length === 10) return `$${base[0]}B`;
      if (stringified.length === 11) return `$${base.slice(0, 1)}B`;
      if (stringified.length === 12) return `$${base.slice(0, 2)}B`;
      return `$${value.toFixed(0)}`;
    } catch (e) {
      console.error(
        "Caught Error Formatting Money, value :" + typeof value + " error:",
        e
      );

      return value.toString();
    }
  }
};
