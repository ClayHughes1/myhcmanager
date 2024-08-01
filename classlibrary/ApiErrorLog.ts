// ApiErrorLogger.ts
import ErrorLogger from '../src/types/ErrorLogger.ts';
import { ErrorDetails } from '../src/types/interfaces';

class ApiErrorLogger extends ErrorLogger {
  async logError(errorDetails: ErrorDetails): Promise<void> {
    try {
        await fetch('http://10.0.2.2:4000/api/logError', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(errorDetails),
        });
      } catch (error) {
        console.error('Failed to log error:', error);
      }
  }
}

export default ApiErrorLogger;
