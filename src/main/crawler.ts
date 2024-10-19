import axios from 'axios';
import * as cheerio from 'cheerio';

interface CrawlOptions {
  url: string;
  crawlDepth: number;
  cssSelector: string;
  maxPages: number;
}

export async function crawl(options: CrawlOptions): Promise<string[]> {
  const { url, crawlDepth, cssSelector, maxPages } = options;
  const visited = new Set<string>();
  const results: string[] = [];

  async function crawlPage(pageUrl: string, depth: number) {
    if (visited.has(pageUrl) || depth > crawlDepth || visited.size >= maxPages) {
      return;
    }

    visited.add(pageUrl);

    try {
      const response = await axios.get(pageUrl);
      const $ = cheerio.load(response.data);

      const content = $(cssSelector).text();
      results.push(`Content from ${pageUrl}: ${content.substring(0, 200)}...`);

      if (depth < crawlDepth) {
        const links = $('a')
          .map((_, element) => $(element).attr('href'))
          .get()
          .filter((href): href is string => typeof href === 'string' && href.startsWith('http'));

        for (const link of links) {
          await crawlPage(link, depth + 1);
          if (visited.size >= maxPages) break;
        }
      }
    } catch (error) {
      results.push(`Error crawling ${pageUrl}: ${error.message}`);
    }
  }

  await crawlPage(url, 0);
  return results;
}

