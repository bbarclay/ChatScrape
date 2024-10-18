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
