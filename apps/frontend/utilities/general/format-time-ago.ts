export function timeSince(date: Date) {
  var seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " Year" + (interval == 1 ? "" : "s");
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " Month" + (interval == 1 ? "" : "s");
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " Day" + (interval == 1 ? "" : "s");
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " Hour" + (interval == 1 ? "" : "s");
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " Minute" + (interval == 1 ? "" : "s");
  }
  return Math.floor(seconds) + " Second" + (interval == 1 ? "" : "s");
}
