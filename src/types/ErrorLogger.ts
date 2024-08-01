// ErrorLogger.ts
import { ErrorDetails } from './interfaces';
import {Alert,} from 'react-native';
import DeviceInfo from 'react-native-device-info';


abstract class ErrorLogger {
  abstract logError(errorDetails: ErrorDetails): Promise<void>;

  protected getDeviceInfo(): string {
    // Replace with actual device info fetching logic if necessary
    return JSON.stringify({
      deviceModel: DeviceInfo.getModel(),
      deviceManufacturer: DeviceInfo.getManufacturerSync(),
      deviceID: DeviceInfo.getUniqueId(),
    });
  }

  handleError(error: Error): void {
    const errorDetails: ErrorDetails = {
      userID: 'user123', // Replace with actual user ID if available
      errorMessage: error.message,
      stackTrace: error.stack ?? '', // Ensure stackTrace is a string
      deviceInfo: this.getDeviceInfo(),
      appVersion: '1.0.0', // Replace with actual app version
      osVersion: '14.0', // Replace with actual OS version
      additionalContext: 'Any additional context', // Optional additional context
    };

    this.logError(errorDetails).catch(logError => {
      console.error('Failed to log error:', logError);
    });

    Alert.alert('An error occurred', error.message);
  }
}

export default ErrorLogger;
