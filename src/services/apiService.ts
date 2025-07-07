import {EnvService} from "./envService";
import axios, {AxiosInstance} from "axios";
import {HetznerServer} from "./types/HetznerServer";

export class ApiService {
    private api: AxiosInstance

    constructor(
        private envService: EnvService,
    ) {
        this.api = axios.create({
            baseURL: `${this.envService.BACKEND_API_HOST}/api/v1/hosts`,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.envService.BACKEND_API_KEY}`
            },
        });
    }

    async getServers() {
        try {
            const response = await this.api.get<HetznerServer[]>('/hetzner');
            return response.data;
        } catch (err) {
            throw new Error(`Failed to get servers: ${err}`);
        }
    }

    async saveServers(actualizedServers: HetznerServer[]) {
        try {
            const response = await this.api.post<HetznerServer>('/actualize', {
                hosts: actualizedServers,
            });
            return response.data;
        } catch (err) {
            throw new Error(`Failed to save servers: ${err}`);
        }
    }
}