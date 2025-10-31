import cron from "node-cron";
import AppUser from "../models/AppUser";
import { EmailUtils } from "../utils/EmailService/emailutils";
import { logger } from "../utils/logger";

export const startMonthlyReminderJob = () => {
  const schedule = '0 9 14 * *' // default: 14th 9AM
  cron.schedule(schedule, async () => {
    logger.info("Running monthly inactivity reminder job...");

    try {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30); // users inactive for 30+ days

      const inactiveUsers = await AppUser.find({
        email: { $exists: true, $ne: null },
        $or: [
          { lastLoginDateTime: { $lt: cutoff } },
          { lastLoginDateTime: { $exists: false } },
        ],
      });

      logger.info(`Found ${inactiveUsers.length} inactive users.`);

      for (const user of inactiveUsers) {
        try {
          await EmailUtils.sendReminderEmail(user.email, user.username);
          logger.info(` Reminder sent to ${user.email} (${user.username})`);
        } catch (err: any) {
          logger.error(` Failed to send reminder to ${user.email}: ${err.message}`);
        }
      }

      logger.info("Monthly reminder job completed.");
    } catch (err: any) {
      logger.error(`Error in monthly reminder job: ${err.message}`);
    }
  });
};
