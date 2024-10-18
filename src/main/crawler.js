// src/main/crawler.js

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Executes the crawler with the provided configuration.
 * @param {Object} config - The crawl configuration.
 * @param {string} config.url - Starting URL.
 * @param {string} config.match - URL pattern to match.
 * @param {string} config.selector - CSS selector.
 * @param {number} config.maxPagesToCrawl - Maximum pages to crawl.
 * @param {string} config.outputDir - Output directory path.
 * @param {string} config.outputFileName - Base output file name.
 * @returns {ChildProcess} - The spawned child process.
 */
function startCrawl(config) {
  // Generate a unique directory name based on timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const crawlDir = path.join(config.outputDir, `crawl-${timestamp}`);

  // Ensure the directory exists
  if (!fs.existsSync(crawlDir)) {
    fs.mkdirSync(crawlDir, { recursive: true });
  }

  // Construct the npx command with required options
  const command = `npx @builder.io/gpt-crawler \
    --url "${config.url}" \
    --match "${config.match}" \
    --selector "${config.selector}" \
    --maxPagesToCrawl ${config.maxPagesToCrawl} \
    --outputFileName "${path.join(crawlDir, config.outputFileName)}"`;

  console.log('Starting the crawl with command:', command);

  // Execute the command and return the child process
  const child = exec(command, { cwd: __dirname });

  // Optional: Timeout to kill the process if it takes too long
  const crawlTimeout = setTimeout(() => {
    console.log('Crawl process taking too long. Terminating...');
    child.kill();
  }, 60000); // 60 seconds timeout

  // Handle process stdout
  child.stdout.on('data', (data) => {
    console.log(`Crawl STDOUT: ${data}`);
  });

  // Handle process stderr
  child.stderr.on('data', (data) => {
    console.error(`Crawl STDERR: ${data}`);
  });

  // Handle process exit
  child.on('exit', (code) => {
    console.log(`Crawl process exited with code ${code}`);
    clearTimeout(crawlTimeout);

    // Process output files if needed
    try {
      const files = fs.readdirSync(crawlDir).filter((file) => file.startsWith('output'));
      files.forEach((file, index) => {
        const newFileName = `output_${index + 1}.json`;
        fs.renameSync(path.join(crawlDir, file), path.join(crawlDir, newFileName));
        console.log(`Renamed ${file} to ${newFileName}`);
      });

      // Optionally, handle post-crawl actions here
    } catch (error) {
      console.error('Error processing output files:', error);
      // Handle the error as needed
    }

    // Do NOT call process.exit(code);
  });

  // Handle process close event
  child.on('close', (code) => {
    console.log(`Crawl process closed with code ${code}`);
    clearTimeout(crawlTimeout);
    // Do NOT call process.exit(code);
  });

  return child;
}

module.exports = { startCrawl };