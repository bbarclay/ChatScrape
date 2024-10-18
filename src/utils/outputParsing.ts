export interface CrawlMessage {
  type: string;
  content: string;
}

export interface CrawlProgress {
  current: number;
  total: number;
}

export interface ParsedCrawlStatus {
  cleanStatus: string;
  progress: CrawlProgress | null;
}

export interface CrawlStatistics {
  requestsFinished: number;
  requestsFailed: number;
  requestAvgFinishedDurationMillis: number | null;
  requestsFinishedPerMinute: number;
  requestsFailedPerMinute: number;
  requestTotalDurationMillis: number;
  requestsTotal: number;
  crawlerRuntimeMillis: number;
}

/**
 * Removes ANSI escape codes and unnecessary prefixes (like INFO PlaywrightCrawler) from a string.
 * @param message - The string to clean.
 * @returns The cleaned string.
 */
export const removeUnnecessaryInfo = (message: string): string => {
  const cleanedMessage = message.replace(/\x1b\[\d+m/g, ''); // Remove ANSI codes
  return cleanedMessage.replace(/^INFO PlaywrightCrawler: /, ''); // Remove "INFO PlaywrightCrawler"
};

/**
 * Determines the type of a message based on its content.
 * @param message - The message string to evaluate.
 * @returns The type of the message ('error', 'warning', 'success', or 'info').
 */
export const determineMessageType = (message: string): string => {
  const cleanMessage = removeUnnecessaryInfo(message);
  const lowerMsg = cleanMessage.toLowerCase();
  if (lowerMsg.includes('error')) return 'error';
  if (lowerMsg.includes('warning')) return 'warning';
  if (
    lowerMsg.includes('success') ||
    lowerMsg.includes('completed') ||
    lowerMsg.includes('finished')
  )
    return 'success';
  return 'info';
};

/**
 * Parses raw crawl output data into structured messages.
 * @param data - The raw crawl output string.
 * @returns An array of parsed CrawlMessage objects.
 */
export const parseCrawlOutput = (data: string): CrawlMessage[] => {
  if (typeof data !== 'string') return [];

  const messages = data.split('\n').filter((msg) => msg.trim() !== '');
  const parsedMessages: CrawlMessage[] = messages.map((msg) => ({
    type: determineMessageType(msg),
    content: removeUnnecessaryInfo(msg),
  }));

  return parsedMessages;
};

/**
 * Parses the crawl status to update progress.
 * @param status - The raw status string.
 * @returns An object containing the cleaned status and progress information.
 */
export const parseCrawlStatus = (status: string): ParsedCrawlStatus => {
  if (typeof status !== 'string') return { cleanStatus: '', progress: null };

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

/**
 * Safely parses an integer from a string.
 * @param value - The string to parse.
 * @returns The parsed integer or 0 if parsing fails.
 */
const safeParseInt = (value: string): number => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Parses the crawl statistics from a JS response.
 * @param stats - The raw statistics object as a string.
 * @returns An object containing the parsed crawl statistics.
 */
export const parseCrawlStatistics = (stats: string): CrawlStatistics | null => {
  try {
    const parsedStats = JSON.parse(stats);
    return {
      requestsFinished: parsedStats.requestsFinished || 0,
      requestsFailed: parsedStats.requestsFailed || 0,
      requestAvgFinishedDurationMillis:
        parsedStats.requestAvgFinishedDurationMillis || null,
      requestsFinishedPerMinute: parsedStats.requestsFinishedPerMinute || 0,
      requestsFailedPerMinute: parsedStats.requestsFailedPerMinute || 0,
      requestTotalDurationMillis: parsedStats.requestTotalDurationMillis || 0,
      requestsTotal: parsedStats.requestsTotal || 0,
      crawlerRuntimeMillis: parsedStats.crawlerRuntimeMillis || 0,
    };
  } catch (error) {
    console.error('Failed to parse crawl statistics:', error);
    return null;
  }
};
