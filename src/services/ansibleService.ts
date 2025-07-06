import {EnvService} from "./envService";
import fs from "fs";
import {AnsibleOutput} from "./types/AnsibleOutput";
import {exec} from "child_process";

interface Host {
    name: string
    ip: string
}

export interface AnsibleServicePaths {
    inventory: string,
    privateKey: string,
    config: string
}

export class AnsibleService {
    constructor(
        private envService: EnvService,
        private ansiblePaths: AnsibleServicePaths
    ) {
    }

    buildInventoryFile(hosts: Host[]) {
        const lines = ['[webservers]'];

        for (const host of hosts) {
            lines.push(`${host.name} ansible_host=${host.ip} ansible_ssh_private_key_file=${this.ansiblePaths.privateKey}`);
        }

        const inventoryContent = lines.join('\n');

        try {
            fs.writeFileSync(this.ansiblePaths.inventory, inventoryContent, 'utf-8');
        } catch (err) {
            throw new Error(`Failed to write inventory file: ${err}`);
        }
    }

    async runPlaybook(playbookPath: string): Promise<AnsibleOutput> {
        return new Promise((resolve, reject) => {
            const command = `ansible-playbook ${playbookPath} --vault-password-file=<(echo "${this.envService.ANSIBLE_VAULT_KEY}")`;
            const env = {
                ...process.env,
                ANSIBLE_CONFIG: this.ansiblePaths.config
            }

            exec(command, {env, shell: "/bin/bash"}, (error, stdout, stderr) => {

                if (error) {
                    reject(`Error: ${error.message}\nstdout: ${stdout}\nstderr: ${stderr}`);
                    return;
                }

                try {
                    const output: AnsibleOutput = JSON.parse(stdout)
                    resolve(output);
                } catch (err) {
                    reject(`Error while parsing JSON: ${err}\nstdout: ${stdout}`);
                    return;
                }
            });
        })
    }
}