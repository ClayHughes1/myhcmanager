
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