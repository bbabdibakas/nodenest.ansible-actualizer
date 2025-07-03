import {EnvService} from "./envService";
import {exec} from "child_process";

export class AnsiblePlaybookService {
    constructor(
        private envService: EnvService,
        private ansibleConfigFile: string,
    ) {
    }

    async run(playbookPath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const command = `ansible-playbook ${playbookPath} --vault-password-file=<(echo "${this.envService.ANSIBLE_VAULT_KEY}")`;
            const env = {
                ...process.env,
                ANSIBLE_CONFIG: this.ansibleConfigFile
            }

            exec(command, {env, shell: "/bin/bash"}, (error, stdout, stderr) => {
                if (error) {
                    reject(`Ошибка: ${error.message}\nstdout: ${stdout}\nstderr: ${stderr}`);
                    return;
                }

                resolve(stdout);
            });
        })
    }
}