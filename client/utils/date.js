export function timeAgo(timeThenInSeconds) {
  const oneMinuteInSeconds = 60;
  const oneHourInSeconds = 3600; // 60 seconds x 60 minutes
  const oneDayInSeconds = 86400; // 60 seconds x 60 minutes x 24 hours
  const oneYearInSeconds = 31556952; // 60 seconds x 60 minutes x 24 hours x 365.2425 days

  const timeNowInSeconds = new Date().getTime() / 1000;
  const timeAgoInSeconds = timeNowInSeconds - timeThenInSeconds;

  if (timeAgoInSeconds > oneYearInSeconds)
    return `${Math.floor(timeAgoInSeconds / oneYearInSeconds)}y`; // 1y
  if (timeAgoInSeconds > oneDayInSeconds)
    return `${Math.floor(timeAgoInSeconds / oneDayInSeconds)}d`; // 365d
  if (timeAgoInSeconds > oneHourInSeconds)
    return `${Math.floor(timeAgoInSeconds / oneHourInSeconds)}h`; // 23h
  if (timeAgoInSeconds > oneMinuteInSeconds)
    return `${Math.floor(timeAgoInSeconds / oneMinuteInSeconds)}m`; // 59m
  return "1m";
}
