export function timeSince(date: Date) {
  var seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " Years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " Months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " Days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " Hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " Minutes";
  }
  return Math.floor(seconds) + " Seconds";
}
