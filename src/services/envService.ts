import dotenv from "dotenv";

dotenv.config();

export class EnvService {
    private readonly ansible_vault_key: string;
    private readonly backend_api_host: string;
    private readonly backend_api_key: string;

    constructor() {
        if (!process.env.ANSIBLE_VAULT_KEY) throw new Error('ANSIBLE_VAULT_KEY is not defined');
        if (!process.env.BACKEND_API_HOST) throw new Error('BACKEND_API_HOST is not defined');
        if (!process.env.BACKEND_API_KEY) throw new Error('BACKEND_API_KEY is not defined');

        this.ansible_vault_key = process.env.ANSIBLE_VAULT_KEY;
        this.backend_api_host = process.env.BACKEND_API_HOST;
        this.backend_api_key = process.env.BACKEND_API_KEY;
    }

    get ANSIBLE_VAULT_KEY() {
        return this.ansible_vault_key;
    }

    get BACKEND_API_HOST() {
        return this.backend_api_host;
    }

    get BACKEND_API_KEY() {
        return this.backend_api_key;
    }
}