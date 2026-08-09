import cron from 'node-cron';
import TransactionRecord from '../models/TransactionRecord';
import AppUser from '../models/AppUser';
import { GooglePlayService } from '../services/googlePlay.service';
import { logger } from '../utils/logger';

// #09: keeps hasPaid accurate after the initial purchase.
//
// Approach chosen: polling, not RTDN/webhook. A webhook needs a Google Cloud
// Pub/Sub topic wired up in Play Console -- external config that doesn't
// exist yet. Polling needs nothing beyond the same Play Developer API access
// #08 already requires, so it's the only approach that can ship today. If
// RTDN is set up later, this job can be swapped for a webhook route without
// changing how entitlement is granted/revoked.
//
// Note: this only revokes hasPaid (cancel/expire/refund-by-expiry). It does
// not detect an immediate refund that predates the subscription's expiry --
// that requires polling `purchases.voidedpurchases.list` separately, which
// is out of scope here since it wasn't in the ticket's checklist.
export const startSubscriptionSyncJob = () => {
  const schedule = '0 4 * * *'; // daily at 4AM UTC

  cron.schedule(schedule, async () => {
    if (!GooglePlayService.isConfigured()) {
      logger.warn('Subscription sync job skipped: Play verification is not configured.');
      return;
    }

    logger.info('Running subscription sync job...');

    try {
      const records = await TransactionRecord.find({
        entitlementGranted: true,
        purchaseToken: { $exists: true, $ne: null },
      });

      let revoked = 0;
      for (const record of records) {
        try {
          const verification = await GooglePlayService.verifySubscriptionPurchase({
            packageName: record.packageName!,
            subscriptionId: record.subscriptionId!,
            purchaseToken: record.purchaseToken!,
          });

          if (verification.status !== 'entitled') {
            await AppUser.updateOne({ _id: record.appUserId }, { $set: { hasPaid: false } });
            revoked += 1;
            logger.info(
              `Revoked hasPaid for user ${record.appUserId} (subscription ${verification.status}).`
            );
          }
        } catch (error) {
          logger.error(`Failed to re-verify subscription for user ${record.appUserId}`, {
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      logger.info(
        `Subscription sync job completed. ${revoked} user(s) revoked out of ${records.length} checked.`
      );
    } catch (error) {
      logger.error('Subscription sync job failed', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
};
