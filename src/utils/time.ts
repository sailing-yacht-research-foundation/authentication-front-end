export const timeMillisToHours = (millis: number | undefined): string => {
  if (!millis) return "00:00:00";

  const currentSecond = Math.floor(millis / 1000);

  const hour: string = `${Math.floor(currentSecond / 3600)}`;
  const minute: string = `${Math.floor((currentSecond % 3600) / 60)}`;
  const second: string = `${currentSecond % 60}`;

  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:${second.padStart(2, "0")}`;
};
