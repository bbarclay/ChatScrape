import { removeUnnecessaryInfo } from "./removeUnnecessaryInfo";

export const determineMessageType = (message: string): string => {
  const cleanMessage = removeUnnecessaryInfo(message);
  const lowerMsg = cleanMessage.toLowerCase();
  if (lowerMsg.includes("error")) return "error";
  if (lowerMsg.includes("warning")) return "warning";
  if (lowerMsg.includes("success") || lowerMsg.includes("completed") || lowerMsg.includes("finished")) return "success";
  return "info";
};


import { determineMessageType } from "./determineMessageType";
import { removeUnnecessaryInfo } from "./removeUnnecessaryInfo";
import { CrawlMessage } from "../../types/crawl";

export const parseCrawlOutput = (data: string): CrawlMessage[] => {
  if (typeof data !== "string") return [];
  const messages = data.split("\n").filter((msg) => msg.trim() !== "");
  return messages.map((msg) => ({
    type: determineMessageType(msg) as "info" | "error" | "warning",
    content: removeUnnecessaryInfo(msg),
  }));
};


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


import { removeUnnecessaryInfo } from "./removeUnnecessaryInfo";
import { safeParseInt } from "./safeParseInt";
import { ParsedCrawlStatus, CrawlProgress } from "../../types/crawl";


export const parseCrawlStatus = (status: string): ParsedCrawlStatus => {
  if (typeof status !== "string") return { cleanStatus: "", progress: null };
  const cleanStatus = removeUnnecessaryInfo(status);
  const matchCrawling = cleanStatus.match(/Crawling: Page (\d+) \/ (\d+)/i);
  let progress: CrawlProgress | null = null;
  if (matchCrawling) {
    const current = safeParseInt(matchCrawling[1]);
    const total = safeParseInt(matchCrawling[2]);
    progress = { current, total };
  }
  return { cleanStatus, progress };
};

export const removeUnnecessaryInfo = (message: string): string => {
  const cleanedMessage = message.replace(/\[\d+m/g, "");
  return cleanedMessage.replace(/^INFO PlaywrightCrawler: /, "");
};

export const safeParseInt = (value: string): number => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 0 : parsed;
};


export { removeUnnecessaryInfo } from "./crawl/removeUnnecessaryInfo";
export { determineMessageType } from "./crawl/determineMessageType";
export { parseCrawlOutput } from "./crawl/parseCrawlOutput";
export { safeParseInt } from "./crawl/safeParseInt";
export { parseCrawlStatus } from "./crawl/parseCrawlStatus";
export { parseCrawlStatistics } from "./crawl/parseCrawlStatistics";
