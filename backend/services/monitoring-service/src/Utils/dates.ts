export function toUtcDayStart(input: Date | string): Date {
  const d = input instanceof Date ? input : new Date(input);

  if (Number.isNaN(d.getTime())) {
    throw new Error("Invalid date");
  }

  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
}

export function nextUtcDayStart(dayStart: Date): Date {
  const next = new Date(dayStart);
  next.setUTCDate(next.getUTCDate() + 1);
  return next;
}
