// src/main/crawler.ts

import { spawn, ChildProcess } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * Interface representing the configuration for the crawler.
 */
export interface CrawlConfig {
  url: string;
  match: string;
  selector: string;
  maxPagesToCrawl: number;
  outputDir: string;
  outputFileName: string;
}

/**
 * Type definition for the sendMessage callback function.
 */
export type SendMessage = (channel: string, message: string) => void;

/**
 * Executes the gpt-crawler CLI directly using the Node.js executable.
 * @param config - The crawl configuration.
 * @param sendMessage - Callback function to send messages to the renderer.
 * @returns The spawned child process or null if an error occurred.
 */
export function startCrawl(
  config: CrawlConfig,
  sendMessage: SendMessage
): ChildProcess | null {
  // Generate a unique directory name based on timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const crawlDir = path.join(config.outputDir, `crawl-${timestamp}`);

  // Ensure the directory exists
  try {
    if (!fs.existsSync(crawlDir)) {
      fs.mkdirSync(crawlDir, { recursive: true });
      sendMessage('crawl-log', `Created crawl directory at: ${crawlDir}`);
    }
  } catch (error: any) {
    const errorMessage = `Error creating crawl directory: ${error.message}`;
    console.error(errorMessage);
    sendMessage('crawl-error', errorMessage);
    return null;
  }

  // Path to the CLI script
  const cliPath = path.join(
    __dirname,
    '..', // Adjust based on your project structure
    'node_modules',
    '@builder.io',
    'gpt-crawler',
    'dist',
    'src',
    'cli.js'
  );

  // Verify that cli.js exists
  if (!fs.existsSync(cliPath)) {
    const errorMessage = `gpt-crawler script not found at: ${cliPath}`;
    console.error(errorMessage);
    sendMessage('crawl-error', errorMessage);
    return null;
  }

  // Check if the file is executable; if not, set permissions
  try {
    fs.accessSync(cliPath, fs.constants.X_OK);
  } catch (err: any) {
    console.warn('gpt-crawler script is not executable. Setting permissions...');
    try {
      fs.chmodSync(cliPath, 0o755);
      console.log('Executable permissions set successfully.');
      sendMessage('crawl-log', 'Executable permissions set successfully.');
    } catch (error: any) {
      const errorMessage = `Failed to set executable permissions: ${error.message}`;
      console.error(errorMessage);
      sendMessage('crawl-error', errorMessage);
      return null;
    }
  }

  // Construct the arguments for the crawler
  const args = [
    cliPath,
    '--url',
    config.url,
    '--match',
    config.match,
    '--selector',
    config.selector,
    '--maxPagesToCrawl',
    config.maxPagesToCrawl.toString(),
    '--outputFileName',
    path.join(crawlDir, config.outputFileName),
  ];

  // Determine the Node.js executable path bundled with Electron
  const nodeExecutable = process.execPath;

  // Log the command being executed
  const commandStr = `${nodeExecutable} ${args.join(' ')}`;
  console.log(`Executing: ${commandStr}`);
  sendMessage('crawl-log', `Executing: ${commandStr}`);

  // Spawn the child process
  const crawlerProcess = spawn(nodeExecutable, args, {
    shell: true, // Ensures compatibility across different platforms
    cwd: config.outputDir, // Set the working directory
    env: process.env, // Inherit environment variables
  });

  // Optional: Set a timeout to terminate the crawl if it takes too long
  const crawlTimeout = setTimeout(() => {
    const timeoutMessage = 'Crawl process taking too long. Terminating...';
    console.warn(timeoutMessage);
    sendMessage('crawl-error', timeoutMessage);
    if (crawlerProcess && crawlerProcess.kill) {
      crawlerProcess.kill('SIGTERM');
    }
  }, 600000); // 10 minutes timeout; adjust as needed

  // Handle stdout data
  crawlerProcess.stdout.on('data', (data: Buffer) => {
    const message = data.toString();
    console.log(`STDOUT: ${message}`);
    sendMessage('crawl-log', message);
  });

  // Handle stderr data
  crawlerProcess.stderr.on('data', (data: Buffer) => {
    const errorMsg = data.toString();
    console.error(`STDERR: ${errorMsg}`);
    sendMessage('crawl-error', errorMsg);
  });

  // Handle process exit
  crawlerProcess.on('exit', (code: number | null, signal: string | null) => {
    clearTimeout(crawlTimeout);
    if (code === 0) {
      const successMessage = `Crawl completed successfully with exit code ${code}`;
      console.log(successMessage);
      sendMessage('crawl-log', successMessage);
    } else {
      const errorMessage = `Crawl exited with code ${code} and signal ${signal}`;
      console.error(errorMessage);
      sendMessage('crawl-error', errorMessage);
    }

    // Optionally, process output files if needed
    try {
      const files = fs
        .readdirSync(crawlDir)
        .filter((file) => file.startsWith('output'));
      files.forEach((file, index) => {
        const newFileName = `output_${index + 1}.json`;
        fs.renameSync(path.join(crawlDir, file), path.join(crawlDir, newFileName));
        console.log(`Renamed ${file} to ${newFileName}`);
        sendMessage('crawl-log', `Renamed ${file} to ${newFileName}`);
      });
    } catch (error: any) {
      const fileErrorMessage = `Error processing output files: ${error.message}`;
      console.error(fileErrorMessage);
      sendMessage('crawl-error', fileErrorMessage);
    }
  });

  // Handle process errors
  crawlerProcess.on('error', (error: Error) => {
    clearTimeout(crawlTimeout);
    const errorMessage = `Failed to start crawl process: ${error.message}`;
    console.error(errorMessage);
    sendMessage('crawl-error', errorMessage);
  });

  return crawlerProcess;
}
