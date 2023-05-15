export function formatInterval(executionInterval: number): {
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
} {
  let minute = 60;
  let hour = 3600;
  let day = 86400;
  let week = 604800;
  let month = day * 30;

  if (executionInterval >= month) {
    const interval =
      parseFloat(
        (executionInterval / month).toFixed(1).toString().split(".")[1]
      ) > 0
        ? parseFloat((executionInterval / month).toFixed(1))
        : executionInterval / month;
    return {
      interval,
      unit: interval === 1 ? "Month" : "Months",
    };
  }
  if (executionInterval >= week) {
    const interval =
      parseFloat(
        (executionInterval / week).toFixed(1).toString().split(".")[1]
      ) > 0
        ? parseFloat((executionInterval / week).toFixed(1))
        : executionInterval / week;
    return {
      interval,
      unit: interval === 1 ? "Week" : "Weeks",
    };
  }
  if (executionInterval >= day) {
    const interval =
      parseFloat(
        (executionInterval / day).toFixed(1).toString().split(".")[1]
      ) > 0
        ? parseFloat((executionInterval / day).toFixed(1))
        : executionInterval / day;
    return {
      interval,
      unit: interval === 1 ? "Day" : "Days",
    };
  }
  if (executionInterval >= hour) {
    const interval: number =
      parseFloat(
        (executionInterval / hour).toFixed(1).toString().split(".")[1]
      ) > 0
        ? parseFloat((executionInterval / hour).toFixed(1))
        : executionInterval / hour;
    return {
      interval,
      unit: interval === 1 ? "Hour" : "Hours",
    };
  }
  if (executionInterval >= minute) {
    const interval =
      parseFloat(
        (executionInterval / minute).toFixed(1).toString().split(".")[1]
      ) > 0
        ? parseFloat((executionInterval / minute).toFixed(1))
        : executionInterval / minute;
    return {
      interval,
      unit: interval === 1 ? "Minute" : "Minutes",
    };
  } else {
    return {
      interval: executionInterval,
      unit: "Seconds",
    };
  }
}
