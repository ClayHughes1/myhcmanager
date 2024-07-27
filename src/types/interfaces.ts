
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