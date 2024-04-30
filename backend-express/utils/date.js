export function timeSpentFrom(date) {
  let time = new Date().getTime() - new Date(date).getTime();
  const isAgo = time > 0;
  time = Math.abs(time);
  let timeStr = "";
  if (time < 1000) timeStr = time + "ms";
  else if (time < 1000 * 60) timeStr = Math.round(time / 1000) + "s";
  else if (time < 1000 * 60 * 60) timeStr = Math.round(time / 1000 / 60) + "m";
  else if (time < 1000 * 60 * 60 * 24)
    timeStr = Math.round(time / 1000 / 60 / 60) + "h";
  else if (time < 1000 * 60 * 60 * 24 * 30)
    timeStr = Math.round(time / 1000 / 60 / 60 / 24) + "d";
  else if (time < 1000 * 60 * 60 * 24 * 30 * 12)
    timeStr = Math.round(time / 1000 / 60 / 60 / 24 / 30) + "mo";
  else timeStr = Math.round(time / 1000 / 60 / 60 / 24 / 30 / 12) + "y";

  return timeStr + (isAgo ? " ago" : " early");
}
