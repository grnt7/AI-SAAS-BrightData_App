import { internalMutation, internalQuery } from "./_generated/server";
import { internal, api } from "./_generated/api";
import { cronJobs } from "convex/server";
import { v } from "convex/values";

/**
 * Timeout configuration (in milliseconds):
 * - Jobs stuck in "pending" for more than 10 minutes are considered failed
 * - Jobs stuck in "running" for more than 30 minutes are considered failed (BrightData scraping)
 * - Jobs stuck in "analyzing" for more than 45 minutes are considered failed (AI analysis)
 */
const TIMEOUTS = {
  pending: 10 * 60 * 1000, // 10 minutes
  running: 30 * 60 * 1000, // 30 minutes
  analyzing: 45 * 60 * 1000, // 45 minutes
} as const;

/**
 * Check for stuck jobs and mark them as failed
 * This runs periodically via cron to catch jobs that never received webhooks
 */
export const checkStuckJobs = internalMutation({
  args: {},
  returns: v.object({
    failedJobs: v.number(),
    checkedStatuses: v.array(v.string()),
  }),
  handler: async (ctx) => {
    const now = Date.now();
    let failedJobsCount = 0;
    const checkedStatuses: string[] = [];

    // Check each status type
    for (const [status, timeoutMs] of Object.entries(TIMEOUTS)) {
      const cutoffTime = now - timeoutMs;

      // Query jobs that are stuck in this status
      // status is a string from Object.entries, but .withIndex expects a specific status enum. Let's assert its type.
      // Cast 'status' to the proper enum type
      const stuckJobs = await ctx.db
        .query("scrapingJobs")
        .withIndex("by_status", (q) =>
          q.eq(
            "status",
            status as "pending" | "running" | "analyzing"
          )
        )
        .filter((q) => q.lt(q.field("createdAt"), cutoffTime))
        .collect();

      if (stuckJobs.length > 0) {
        checkedStatuses.push(`${status}:${stuckJobs.length}`);
        console.log(
          `Found ${stuckJobs.length} stuck jobs in "${status}" status (older than ${timeoutMs / 1000 / 60} minutes)`
        );

        // Mark each stuck job as failed
        for (const job of stuckJobs) {
          const ageMinutes = Math.round((now - job.createdAt) / 1000 / 60);
          await ctx.db.patch(job._id, {
            status: "failed",
            error: `Job timed out after ${ageMinutes} minutes in "${status}" status. The webhook may not have been received or the process may have failed silently.`,
            completedAt: now,
          });
          failedJobsCount++;
          console.log(
            `Marked job ${job._id} as failed (was stuck in "${status}" for ${ageMinutes} minutes)`
          );
        }
      }
    }

    if (failedJobsCount > 0) {
      console.log(
        `Timeout check completed: ${failedJobsCount} jobs marked as failed`
      );
    }

    return {
      failedJobs: failedJobsCount,
      checkedStatuses,
    };
  },
});

// Set up cron job to run every 5 minutes
const cron = cronJobs();

cron.interval(
  "checkStuckJobs",
  { minutes: 5 },
  internal.monitoring.checkStuckJobs
);

export default cron;