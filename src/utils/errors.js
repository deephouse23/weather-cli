export class WeatherError extends Error {
  constructor(message, code, statusCode = null) {
    super(message);
    this.name = 'WeatherError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export function mapErrorToExitCode(error) {
  if (error instanceof WeatherError) {
    switch (error.code) {
      case 'API_KEY_MISSING':
      case 'API_KEY_INVALID':
        return 2;
      case 'LOCATION_NOT_FOUND':
        return 3;
      case 'NETWORK_ERROR':
        return 4;
      case 'RATE_LIMIT':
        return 5;
      case 'INVALID_INPUT':
        return 6;
      default:
        return 1;
    }
  }
  return 1;
}

export const ERROR_CODES = {
  API_KEY_MISSING: 'API_KEY_MISSING',
  API_KEY_INVALID: 'API_KEY_INVALID',
  LOCATION_NOT_FOUND: 'LOCATION_NOT_FOUND',
  NETWORK_ERROR: 'NETWORK_ERROR',
  RATE_LIMIT: 'RATE_LIMIT',
  INVALID_INPUT: 'INVALID_INPUT',
  CACHE_ERROR: 'CACHE_ERROR'
};