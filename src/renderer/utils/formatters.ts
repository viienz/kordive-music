export function formatDuration(seconds: number): string {
  const safeSec = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safeSec / 60);
  const secs = safeSec % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
