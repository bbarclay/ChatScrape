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
