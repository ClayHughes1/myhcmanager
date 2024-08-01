
export interface ClientDetails {
    First: string;
    Last: string;
    Email: string;
    PlanStart: string;
    PlanEnd: string;
    HasOrder: boolean
}

export interface Client {
    Id: number;
    First: string;
    Last: string;
    Email: string;
    PlanStart: string;
    PlanEnd: string;
    HasOrder: boolean
}

export interface MyAppData {
    MeetDate: string;
    MeetTime: string;
    MeetDescription:string
}
export interface AdminAppData {
    Id: number;
    MeetDate: string;
    MeetTime: string;
    MeetDescription:string
    First: string;
    Last: string;
}
export interface ResponseItem {
    Date: string; // Use the appropriate type (e.g., Date if it's a Date object)
    Time: Date
}
export interface MarkedDate {
    marked: boolean;
    dotColor: string;
}
export interface Item {
    Date: string;
    Time: string;
    Id: number | string; // Choose the appropriate type for your Id
}
export interface ErrorDetails {
    userID: string; // User ID (optional)
    errorMessage: string; // Error message
    stackTrace?: string; // Stack trace of the error
    deviceInfo: string; // Device information
    appVersion: string; // Application version
    osVersion: string; // Operating system version
    additionalContext?: string; // Optional additional context
}