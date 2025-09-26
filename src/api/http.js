import axios from 'axios';
import axiosRetry from 'axios-retry';
import chalk from 'chalk';

// Enable debug logging via environment variable
const DEBUG = process.env.WEATHER_DEBUG === 'true' || process.env.DEBUG === 'true';

const httpClient = axios.create({
  timeout: 5000,
  headers: {
    'User-Agent': 'weather-cli/0.3.0',
    'X-Request-ID': () => `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
});

// Configure retry logic
axiosRetry(httpClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // Retry on network errors
    if (axiosRetry.isNetworkError(error)) {
      return true;
    }
    
    // Retry on 5xx errors and 429 (rate limit)
    if (error.response) {
      const status = error.response.status;
      return status >= 500 || status === 429;
    }
    
    return false;
  },
  onRetry: (retryCount, error, requestConfig) => {
    if (DEBUG) {
      console.log(chalk.yellow(`[DEBUG] Retry attempt ${retryCount}/${3}`));
      console.log(chalk.yellow(`  URL: ${requestConfig.url}`));
      console.log(chalk.yellow(`  Error: ${error.message}`));
      console.log(chalk.yellow(`  Status: ${error.response?.status || 'Network Error'}`));
      console.log(chalk.yellow(`  Delay: ${Math.pow(2, retryCount - 1)} seconds`));
    }
  }
});

// Add request interceptor for debug logging
if (DEBUG) {
  httpClient.interceptors.request.use((config) => {
    console.log(chalk.cyan(`[DEBUG] Request: ${config.method?.toUpperCase()} ${config.url}`));
    if (config.params) {
      console.log(chalk.cyan(`  Params: ${JSON.stringify(config.params)}`));
    }
    return config;
  });
}

// Add response interceptor for rate limit handling and debug logging
httpClient.interceptors.response.use(
  (response) => {
    if (DEBUG) {
      console.log(chalk.green(`[DEBUG] Response: ${response.status} ${response.statusText}`));
      console.log(chalk.green(`  URL: ${response.config.url}`));
      console.log(chalk.green(`  Time: ${response.headers['x-response-time'] || 'N/A'}`));
    }
    return response;
  },
  (error) => {
    if (DEBUG && error.response) {
      console.log(chalk.red(`[DEBUG] Error Response: ${error.response.status}`));
      console.log(chalk.red(`  URL: ${error.config?.url}`));
      console.log(chalk.red(`  Message: ${error.message}`));
    }

    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      const waitTime = retryAfter ? parseInt(retryAfter) : 60;
      const suggestions = [
        `Wait ${waitTime} seconds before retrying`,
        'Consider caching results with "weather cache"',
        'Free tier allows 60 calls/minute, 1M calls/month'
      ];
      error.message = `Rate limit exceeded (429). ${suggestions.join(' | ')}`;
      error.rateLimitInfo = { waitTime, retryAfter };
    }
    return Promise.reject(error);
  }
);

export default httpClient;