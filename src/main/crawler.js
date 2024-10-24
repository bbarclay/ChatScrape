import { crawl } from '@builder.io/gpt-crawler';
import fs from 'fs';
import path from 'path';

/**
 * Executes the crawler with the provided configuration.
 * @param {Object} config - The crawl configuration.
 * @param {string} config.url - Starting URL.
 * @param {string} config.match - URL pattern to match.
 * @param {string} config.selector - CSS selector.
 * @param {number} config.maxPagesToCrawl - Maximum pages to crawl.
 * @param {string} config.outputDir - Output directory path.
 * @param {string} config.outputFileName - Base output file name.
 * @returns {Promise<void>} - A promise that resolves when the crawl is complete.
 */
async function startCrawl(config) {
  // Generate a unique directory name based on timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const crawlDir = path.join(config.outputDir, `crawl-${timestamp}`);

  try {
    // Ensure the directory exists
    if (!fs.existsSync(crawlDir)) {
      fs.mkdirSync(crawlDir, { recursive: true });
    }
  } catch (err) {
    console.error('Error creating directory:', crawlDir, err);
    throw err; // Fail early if we can't create the directory
  }

  // Print the working directory for debugging
  console.log('Current working directory:', process.cwd());
  console.log('Crawl output directory:', crawlDir);

  try {
    // Start the crawl
    await crawl({
      url: config.url,
      match: config.match,
      selector: config.selector,
      maxPagesToCrawl: config.maxPagesToCrawl,
      outputFileName: path.join(crawlDir, config.outputFileName),
    });

    // Process output files if needed
    const files = fs.readdirSync(crawlDir).filter((file) => file.startsWith('output'));
    files.forEach((file, index) => {
      const newFileName = `output_${index + 1}.json`;
      fs.renameSync(path.join(crawlDir, file), path.join(crawlDir, newFileName));
      console.log(`Renamed ${file} to ${newFileName}`);
    });

    console.log('Crawl completed successfully.');
  } catch (error) {
    console.error('Error during crawl:', error);
    throw error;
  }
}

export { startCrawl };
