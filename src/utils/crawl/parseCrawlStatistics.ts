import { CrawlStatistics } from "../../types/crawl";

export const parseCrawlStatistics = (stats: string): CrawlStatistics | null => {
  try {
    const parsedStats = JSON.parse(stats);
    return {
      requestsFailed: parsedStats.requestsFailed || 0,
      requestAvgFinishedDurationMillis: parsedStats.requestAvgFinishedDurationMillis || null,
      requestsFinishedPerMinute: parsedStats.requestsFinishedPerMinute || 0,
      requestsFailedPerMinute: parsedStats.requestsFailedPerMinute || 0,
      requestTotalDurationMillis: parsedStats.requestTotalDurationMillis || 0,
      crawlerRuntimeMillis: parsedStats.crawlerRuntimeMillis || 0,
      totalPagesCrawled: parsedStats.totalPagesCrawled || 0,
      totalErrors: parsedStats.totalErrors || 0,
      totalWarnings: parsedStats.totalWarnings || 0,
      crawlDuration: parsedStats.crawlDuration || 0,
      averageResponseTime: parsedStats.averageResponseTime || 0,
      totalRequests: parsedStats.totalRequests || 0,
      requestsFinished: parsedStats.requestsFinished || 0,
    };
  } catch (error) {
    console.error("Failed to parse crawl statistics:", error);
    return null;
  }
};
