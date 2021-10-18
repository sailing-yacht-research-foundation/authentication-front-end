export const timeMillisToHours = (millis: number | undefined): string => {
  if (!millis) return "00:00:00";

  const currentSecond = Math.round(millis / 1000);

  let hour: number | string = Math.round(currentSecond / 3600);
  let minute: number | string = Math.round((currentSecond % 3600) / 60);
  let second: number | string = currentSecond % 60;

  if (hour < 10) hour = `0${hour}`;
  if (minute < 10) minute = `0${minute}`;
  if (second < 10) second = `0${second}`;

  return `${hour}:${minute}:${second}`;
};
