import {EnvService} from "./envService";
import axios, {AxiosInstance} from "axios";

export interface Server {
    id: number;
    name: string;
    status: 'initializing' | 'running' | 'deleting' | 'offline' | 'starting' | 'stopping' | 'error';
    created: string;
    publicNetIPv4: {
        ip: string;
        blocked: boolean;
    };
    isUnreachable?: boolean;
    isConfigFileExists: boolean
    healthStatus?: {
        status: number;
        data: any;
    }
}

export class ApiService {
    private api: AxiosInstance

    constructor(
        private envService: EnvService,
    ) {
        this.api = axios.create({
            baseURL: `${this.envService.BACKEND_API_HOST}/api/v1/servers`,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.envService.BACKEND_API_KEY}`
            },
        });
    }

    async getServers() {
        try {
            const response = await this.api.get<Server[]>('');
            return response.data;
        } catch (err) {
            throw new Error(`Failed to get servers: ${err}`);
        }
    }

    async saveServers(actualizedServers: Server[]) {
        try {
            const response = await this.api.post('', actualizedServers);
            return response.data;
        } catch (err) {
            throw new Error(`Failed to get servers: ${err}`);
        }
    }
}