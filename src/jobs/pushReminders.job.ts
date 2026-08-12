import cron from 'node-cron';
import AppUser from '../models/AppUser';
import { NeckAngleRecordModel } from '../models/NeckAngleRecord';
import { PushNotificationDriver } from '../services/pushNotificationDriver';
import { PushNotificationModelDTO } from '../types/pushNotificationModel.types';
import { logger } from '../utils/logger';

// Throttling: never re-send the same nudge to the same user more often
// than this, regardless of how often the cron itself runs.
const GOAL_REMINDER_COOLDOWN_HOURS = 72;
const CHECKIN_REMINDER_COOLDOWN_HOURS = 24;

// Give a brand-new signup a day before nagging them to set a goal.
const MIN_ACCOUNT_AGE_HOURS = 24;
// "Been a while" threshold for a check-in nudge.
const CHECKIN_STALE_HOURS = 24;

function hoursAgo(hours: number): Date {
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

function isDue(lastSentAt: Date | undefined, cooldownHours: number): boolean {
  return !lastSentAt || lastSentAt < hoursAgo(cooldownHours);
}

/**
 * Nudges users who signed up but never turned a goal on.
 * Runs daily at 10:00 UTC.
 */
export const startGoalReminderJob = () => {
  cron.schedule('0 10 * * *', async () => {
    logger.info('Running goal-not-set reminder job...');
    try {
      const candidates = await AppUser.find({
        isGoalOn: false,
        fcmToken: { $exists: true, $ne: null },
        allowPushNotifications: true,
        deleted: { $ne: true },
        dateRegistered: { $lt: hoursAgo(MIN_ACCOUNT_AGE_HOURS) },
      });

      const due = candidates.filter((u) => isDue(u.lastGoalReminderSentAt, GOAL_REMINDER_COOLDOWN_HOURS));
      if (due.length === 0) {
        logger.info('Goal reminder job: nobody due.');
        return;
      }

      const messages: PushNotificationModelDTO[] = due.map((u) => ({
        to: u.fcmToken,
        title: 'Set a posture goal 🎯',
        body: "You haven't set a neck-angle goal yet — pick a target and we'll help you track it.",
        data: { type: 'goal_reminder' },
      }));

      const results = await PushNotificationDriver.sendBatch(messages);

      await Promise.all(
        due.map((u, i) => {
          if (!results[i]) return Promise.resolve();
          u.lastGoalReminderSentAt = new Date();
          return u.save();
        })
      );

      logger.info(`Goal reminder job: sent ${results.filter(Boolean).length}/${due.length}.`);
    } catch (err: any) {
      logger.error(`Error in goal reminder job: ${err.message}`);
    }
  });
};

/**
 * Nudges users (goal on or off) who haven't logged a neck-angle check-in
 * recently. Copy differs slightly depending on whether they have an
 * active goal. Runs daily at 17:00 UTC (afternoon, most timezones).
 */
export const startCheckInReminderJob = () => {
  cron.schedule('0 17 * * *', async () => {
    logger.info('Running check-in reminder job...');
    try {
      const candidates = await AppUser.find({
        fcmToken: { $exists: true, $ne: null },
        allowPushNotifications: true,
        deleted: { $ne: true },
        dateRegistered: { $lt: hoursAgo(MIN_ACCOUNT_AGE_HOURS) },
      });

      const staleCutoff = hoursAgo(CHECKIN_STALE_HOURS);
      const messages: PushNotificationModelDTO[] = [];
      const dueUsers: (typeof candidates)[number][] = [];

      for (const user of candidates) {
        if (!isDue(user.lastCheckInReminderSentAt, CHECKIN_REMINDER_COOLDOWN_HOURS)) continue;

        const lastRecord = await NeckAngleRecordModel.findOne({ appUserId: user._id.toString() })
          .sort({ dateTimeRecorded: -1 })
          .select('dateTimeRecorded');

        const hasCheckedInRecently = !!lastRecord && lastRecord.dateTimeRecorded > staleCutoff;
        if (hasCheckedInRecently) continue;

        dueUsers.push(user);
        messages.push({
          to: user.fcmToken,
          title: user.isGoalOn ? "It's been a while 👋" : 'Quick neck check?',
          body: user.isGoalOn
            ? "You haven't logged a neck-angle check-in today — a quick check keeps your goal on track."
            : "It's been a while since your last neck-angle check. Open CerviTech for a 30-second check-in.",
          data: { type: 'checkin_reminder' },
        });
      }

      if (messages.length === 0) {
        logger.info('Check-in reminder job: nobody due.');
        return;
      }

      const results = await PushNotificationDriver.sendBatch(messages);

      await Promise.all(
        dueUsers.map((u, i) => {
          if (!results[i]) return Promise.resolve();
          u.lastCheckInReminderSentAt = new Date();
          return u.save();
        })
      );

      logger.info(`Check-in reminder job: sent ${results.filter(Boolean).length}/${dueUsers.length}.`);
    } catch (err: any) {
      logger.error(`Error in check-in reminder job: ${err.message}`);
    }
  });
};

export const startPushReminderJobs = () => {
  startGoalReminderJob();
  startCheckInReminderJob();
};