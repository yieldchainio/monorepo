/**
 * A function to format second-based intervals into units + their corresponding
 * values.
 *
 * e.g 124...44 == 2.2 Months
 */

export const getInterval = (
  seconds: number
): {
  interval: number;
  unit:
    | "Days"
    | "Minutes"
    | "Seconds"
    | "Months"
    | "Weeks"
    | "Years"
    | "Day"
    | "Minute"
    | "Second"
    | "Month"
    | "Week"
    | "Year"
    | "Hour"
    | "Hours";
} => {
  let minute = 60;
  let hour = 3600;
  let day = 86400;
  let week = 604800;
  let month = day * 30;

  if (seconds >= month) {
    const interval =
      parseFloat((seconds / month).toFixed(1).toString().split(".")[1]) > 0
        ? parseFloat((seconds / month).toFixed(1))
        : seconds / month;
    return {
      interval,
      unit: interval === 1 ? "Month" : "Months",
    };
  }
  if (seconds >= week) {
    const interval =
      parseFloat((seconds / week).toFixed(1).toString().split(".")[1]) > 0
        ? parseFloat((seconds / week).toFixed(1))
        : seconds / week;
    return {
      interval,
      unit: interval === 1 ? "Week" : "Weeks",
    };
  }
  if (seconds >= day) {
    const interval =
      parseFloat((seconds / day).toFixed(1).toString().split(".")[1]) > 0
        ? parseFloat((seconds / day).toFixed(1))
        : seconds / day;
    return {
      interval,
      unit: interval === 1 ? "Day" : "Days",
    };
  }
  if (seconds >= hour) {
    const interval: number =
      parseFloat((seconds / hour).toFixed(1).toString().split(".")[1]) > 0
        ? parseFloat((seconds / hour).toFixed(1))
        : seconds / hour;
    return {
      interval,
      unit: interval === 1 ? "Hour" : "Hours",
    };
  }
  if (seconds >= minute) {
    const interval =
      parseFloat((seconds / minute).toFixed(1).toString().split(".")[1]) > 0
        ? parseFloat((seconds / minute).toFixed(1))
        : seconds / minute;
    return {
      interval,
      unit: interval === 1 ? "Minute" : "Minutes",
    };
  } else {
    return { interval: seconds, unit: "Seconds" };
  }
};
