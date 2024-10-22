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
 * @returns {ChildProcess|null} - The spawned child process or null if an error occurred.
 */
function startCrawl(config) {
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
    return null; // Fail early if we can't create the directory
  }

  // Print the working directory for debugging
  console.log('Current working directory:', process.cwd());
  console.log('Crawl output directory:', crawlDir);

  // Construct the npx command with required options
  const command = `npx @builder.io/gpt-crawler \
    --url "${config.url}" \
    --match "${config.match}" \
    --selector "${config.selector}" \
    --maxPagesToCrawl ${config.maxPagesToCrawl} \
    --outputFileName "${path.join(crawlDir, config.outputFileName)}"`;

  console.log('Starting the crawl with command:', command);

  // Use process.cwd() instead of __dirname to avoid ENOTDIR error
  const child = exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing the crawl command: ${error.message}`);
      console.log('Retrying...');
      startCrawl(config); // Retry logic: call startCrawl again
      return;
    }
  });

  // Timeout to kill the process if it takes too long
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

    if (code !== 0) {
      console.error(`Crawl failed with exit code ${code}. Retrying...`);
      startCrawl(config); // Retry logic: retry if the exit code is non-zero
      return;
    }

    // Process output files if needed
    try {
      const files = fs.readdirSync(crawlDir).filter((file) => file.startsWith('output'));
      files.forEach((file, index) => {
        const newFileName = `output_${index + 1}.json`;
        fs.renameSync(path.join(crawlDir, file), path.join(crawlDir, newFileName));
        console.log(`Renamed ${file} to ${newFileName}`);
      });
    } catch (error) {
      console.error('Error processing output files:', error);
    }
  });

  // Handle process close event
  child.on('close', (code) => {
    console.log(`Crawl process closed with code ${code}`);
    clearTimeout(crawlTimeout);
  });

  return child;
}

module.exports = { startCrawl };
