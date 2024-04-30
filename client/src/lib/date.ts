export function timeSpentFrom(date: string) {
  const time = new Date().getTime() - new Date(date).getTime();
  if (time < 1000) return time + "ms ago";
  if (time < 1000 * 60) return Math.round(time / 1000) + "s ago";
  if (time < 1000 * 60 * 60) return Math.round(time / 1000 / 60) + "m ago";
  if (time < 1000 * 60 * 60 * 24)
    return Math.round(time / 1000 / 60 / 60) + "h ago";
  if (time < 1000 * 60 * 60 * 24 * 30)
    return Math.round(time / 1000 / 60 / 60 / 24) + "d ago";
  if (time < 1000 * 60 * 60 * 24 * 30 * 12)
    return Math.round(time / 1000 / 60 / 60 / 24 / 30) + "mo ago";
  return Math.round(time / 1000 / 60 / 60 / 24 / 30 / 12) + "y ago";
}

export function formatDuration(mins: number) {
  console.log({ mins });
  // mins can be a float too
  const hours = Math.floor(mins / 60);
  const minutes = Math.floor(mins % 60);
  return `${hours}h ${minutes}m ${Math.round((mins % 1) * 60)}s`;
}
