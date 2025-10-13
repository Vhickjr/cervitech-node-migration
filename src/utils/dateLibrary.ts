import { AbbreviatedNeckAngleRecordViewModel } from "../viewmodels/AbbreviatedNeckAngleRecord.viewmodel";
import { DailyAngleDataViewModel } from "../viewmodels/DailyAngleData.viewmodel";

export class DateLibrary {
  static getCurrentDateTime(): Date {
    const now = new Date();
    now.setHours(now.getUTCHours() + 1);
    return now;
  }

  static getDaySet(): string {
    const day = new Date().getUTCDay(); // 0 = Sunday, 1 = Monday, ...
    const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    return daysMap[day];
  }

  static getYesterdayDateTime(): Date {
    const now = new Date();
    now.setUTCDate(now.getUTCDate() - 1);
    return now;
  }

  static getLastWeekDateTime(): Date {
    const now = new Date();
    now.setUTCDate(now.getUTCDate() - 7);
    return now;
  }

  static addMinutesToCurrentTime(minutes: number): Date {
    const now = new Date();
    now.setHours(now.getUTCHours() + 1);
    now.setMinutes(now.getMinutes() + minutes);
    return now;
  }

  static addDaysToCurrentTime(days: number): Date {
    const now = new Date();
    now.setUTCDate(now.getUTCDate() + days);
    return now;
  }

  static addMonthsToCurrentTime(months: number): Date {
    const now = new Date();
    now.setUTCMonth(now.getUTCMonth() + months);
    return now;
  }

  static addYearsToCurrentTime(years: number): Date {
    const now = new Date();
    now.setUTCFullYear(now.getUTCFullYear() + years);
    return now;
  }

  static getWeekNumberOfMonth(date: Date): number {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstMonday = new Date(firstDayOfMonth);
    const dayOffset = (8 - firstDayOfMonth.getDay()) % 7;
    firstMonday.setDate(firstDayOfMonth.getDate() + dayOffset);

    if (firstMonday > date) {
      const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      const prevMonthMonday = new Date(prevMonth);
      const offset = (8 - prevMonth.getDay()) % 7;
      prevMonthMonday.setDate(prevMonth.getDate() + offset);
      return Math.floor((date.getTime() - prevMonthMonday.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
    }

    return Math.floor((date.getTime() - firstMonday.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
  }

  static startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  static endOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  static getEachDayOfWeekAverage(
    records: AbbreviatedNeckAngleRecordViewModel[]
  ): DailyAngleDataViewModel[] {
    const days = ['MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT', 'SUN'];
    const sums = new Array(7).fill(0);
    const counts = new Array(7).fill(0);

    records.forEach((r) => {
      const dow = r.dateTimeRecorded.getDay(); // 0 = Sun, 1 = Mon ...
      // map Sun(0) -> index 6, Mon(1)->0 ...
      const idx = (dow + 6) % 7;
      sums[idx] += r.angle;
      counts[idx] += 1;
    });

    return days.map((day, idx) => ({
      day,
      averageNeckAngle: counts[idx] === 0 ? 0 : +(sums[idx] / counts[idx]).toFixed(1),
    }));
  }


  static formatDay(day: string) {
    switch (day.toLowerCase().trim()) {
      case 'sunday':
        return 'SUN';
      case 'monday':
        return 'MON';
      case 'tuesday':
        return 'TUE';
      case 'wednesday':
        return 'WED';
      case 'thursday':
        return 'THUR';
      case 'friday':
        return 'FRI';
      case 'saturday':
        return 'SAT';
      default:
        return 'NIL';
    }
  }
  
  static startOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay(); 
    let delta = 1 - day; 

    if (day === 0) {
     
      delta = -6;
    }

    d.setDate(d.getDate() + delta);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  static endOfWeek(date: Date): Date {
    const monday = this.startOfWeek(date);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return sunday;
  }
}
