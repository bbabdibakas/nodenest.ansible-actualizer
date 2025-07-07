export interface HetznerServer {
    hostId: number;
    name: string;
    status: 'initializing' | 'running' | 'deleting' | 'offline' | 'starting' | 'stopping' | 'error';
    created: Date;
    ip: string;
    isIpBlocked: boolean;
    isUnreachable?: boolean;
    isConfigFileExists?: boolean
    wabaHealthStatusCode?: number
}