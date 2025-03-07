import cronParser from 'cron-parser';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc);


export const isValidCron = (cronExpression:string)=>{
  const cronArr = cronExpression?.split(' ')
  return cronArr?.length===5

}
/**
 * Get the days of the year when the cron expression will run.
 * @param cron The cron expression.
 * @param year The year to check for cron runs.
 * @returns Array of days in the year when the cron expression will run, formatted as ["yyyy-MM-dd", 1].
 */
export const getCronRunDays = (cronExpression: string, year: number): [string, number][] => {
    try {
      const interval = cronParser.parse(cronExpression, { currentDate: new Date(year, 0, 1) });
      const daysOfYear: Map<string, number> = new Map();
      const batchSize = 100; // Adjust batch size for performance
  
      while (true) {
        // Get next 'batchSize' occurrences at once
        for (let i = 0; i < batchSize; i++) {
          const date = interval.next();
          if (date.getFullYear() !== year) return Array.from(daysOfYear.entries());
  
          const formattedDate = dayjs(date as unknown as Date).format('YYYY-MM-DD');
          if (!daysOfYear.has(formattedDate)) {
            daysOfYear.set(formattedDate, 1);
          }
        }
      }
    } catch {
      return [];
    }
  };



/**
 * Validate if the provided cron expression is valid.
 * @param cron The cron expression.
 * @returns Promise that resolves if valid, rejects with an error message if invalid.
 */
export const validateCron = (cronExpression: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        // Attempt to parse the cron expression using cron-parser
        cronParser.parse(cronExpression);
        resolve(); // Valid cron expression
        return true;
      } catch (error) {
        reject('Invalid cron expression'); // Invalid cron expression
        return false;
      }
    });
  };


  /**
 * Get the execution times of a cron expression within a single day.
 * Ignores month and year, focusing only on hours and minutes.
 *
 * @param cron The cron expression.
 * @returns Array of execution timestamps formatted as HH:mm.
 */
export const getCronRunTimesInDay = (cronExpression: string): string[] => {
    try {
      const startOfDay = dayjs().startOf('day').toDate(); // 00:00 of today
      const interval = cronParser.parse(cronExpression, { currentDate: startOfDay });
  
      const timesSet: Set<string> = new Set();
      let date = interval.next(); // Get first occurrence
  
      // Iterate for 24 hours (to get all executions within the day)
      while (dayjs(date as unknown as Date).isBefore(dayjs(startOfDay).endOf('day'))) {
        timesSet.add(dayjs(date as unknown as Date).format('HH:mm')); // Store formatted time
        date = interval.next();
      }
  
      return Array.from(timesSet);
    } catch (e) {
      return [];
    }
  };



/**
 * Get the execution times of a cron expression within a single day.
 * Adjusts times according to a given timezone offset.
 *
 * @param cron The cron expression.
 * @param offset Timezone offset in hours (e.g., -5 for EST, +2 for CET).
 * @returns Array of execution times with values { time: 'HH:mm', value: 1 or 0 }.
 */
export const getCronRunTimesWithValuesInDay = (cronExpression: string, offset: number): { time: string; value: number }[] => {
    try {
      const startOfDayUTC = dayjs().utc().startOf('day'); // Get 00:00 UTC
      const startOfDayLocal = startOfDayUTC
  
      const interval = cronParser.parse(cronExpression, { currentDate:  dayjs().startOf('day').subtract(7,'day').toDate() });
  
      const timesSet: Set<string> = new Set();
      let date = interval.next(); // Get first occurrence
  
      // Iterate for 24 hours (in local time)
      while (dayjs(date as unknown as Date).isBefore(startOfDayLocal.endOf('day'))) {
        // Store time in HH:mm format, applying the offset
        const adjustedTime = dayjs(date as unknown as Date).add(offset, 'hour').format('HH:mm');
        timesSet.add(adjustedTime);
  
        date = interval.next();
      }
  
      // Generate all possible times in a day (HH:mm format)
      const allTimes: string[] = [];
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute++) {
          const time = dayjs().hour(hour).minute(minute).format('HH:mm');
          allTimes.push(time);
        }
      }
  
      // Create result array with `value: 1` for matching times, `value: 0` otherwise
      const result = allTimes.map((time) => ({
        time,
        value: timesSet.has(time) ? 1 : 0,
      }));
  
      return result;
    } catch (e) {
      console.error('Error parsing cron:', e);
      return [];
    }
  };


  const timeZoneMap: Record<number, string[]> = {
    "-12": ["Etc/GMT+12"],
    "-11": ["Pacific/Pago_Pago", "Pacific/Niue"],
    "-10": ["Pacific/Honolulu"],
    "-9": ["America/Anchorage"],
    "-8": ["America/Los_Angeles"],
    "-7": ["America/Denver", "America/Phoenix"],
    "-6": ["America/Chicago"],
    "-5": ["America/New_York"],
    "-4": ["America/Caracas", "America/Halifax"],
    "-3": ["America/Sao_Paulo"],
    "-2": ["Atlantic/South_Georgia"],
    "-1": ["Atlantic/Azores"],
    "0": ["UTC", "Europe/London"],
    "1": ["Europe/Berlin", "Europe/Paris"],
    "2": ["Europe/Kiev", "Europe/Istanbul"],
    "3": ["Europe/Moscow", "Africa/Nairobi"],
    "3.5": ["Asia/Tehran"],
    "4": ["Asia/Dubai"],
    "4.5": ["Asia/Kabul"],
    "5": ["Asia/Karachi"],
    "5.5": ["Asia/Kolkata"],
    "6": ["Asia/Dhaka"],
    "7": ["Asia/Bangkok"],
    "8": ["Asia/Shanghai", "Asia/Singapore"],
    "9": ["Asia/Tokyo"],
    "9.5": ["Australia/Darwin"],
    "10": ["Australia/Sydney"],
    "11": ["Pacific/Noumea"],
    "12": ["Pacific/Auckland"],
  };
  
  /**
   * Get timezone names by UTC offset.
   * @param offset The UTC offset in hours.
   * @returns Array of timezone names.
   */
  export const getTimeZonesByOffset = (offset: number): string[] => {
    return timeZoneMap[offset] || ["Unknown"];
  };
  

  /**
 * Modify a cron expression by replacing a specific field with '*'.
 * @param {string} cronExpression - The original cron expression.
 * @param {number} fieldIndex - The index of the field to modify (0=min, 1=hour, 2=day, 3=month, 4=weekday).
 * @returns {string} - The modified cron expression.
 */
export const modifyCronField = (cronExpression:string, fieldIndex:number,newValue:string) => {
  const parts = cronExpression.split(" ");
  if (parts.length !== 5) throw new Error("Invalid cron expression. Expected 5 fields.");
  if (fieldIndex < 0 || fieldIndex > 4) throw new Error("Invalid field index. Use 0-4.");

  parts[fieldIndex] = newValue; // Replace specified field with '*'
  return parts.join(" ");
};