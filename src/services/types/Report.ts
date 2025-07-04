export interface Report {
    name: string;
    isUnreachable: boolean;
    healthStatus: {
        status: number;
        data: any;
    } | null
}