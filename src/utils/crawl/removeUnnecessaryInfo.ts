export const removeUnnecessaryInfo = (message: string): string => {
  const cleanedMessage = message.replace(/\[\d+m/g, "");
  return cleanedMessage.replace(/^INFO PlaywrightCrawler: /, "");
};
