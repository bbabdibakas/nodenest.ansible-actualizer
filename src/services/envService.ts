import dotenv from "dotenv";

dotenv.config();

export class EnvService {
    private readonly ansible_vault_key: string;

    constructor() {
        if (!process.env.ANSIBLE_VAULT_KEY) throw new Error('ANSIBLE_VAULT_KEY is not defined');

        this.ansible_vault_key = process.env.ANSIBLE_VAULT_KEY;
    }

    get ANSIBLE_VAULT_KEY() {
        return this.ansible_vault_key;
    }
}