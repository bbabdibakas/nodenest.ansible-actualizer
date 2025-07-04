import {EnvService} from "./envService";
import {exec} from "child_process";
import {AnsibleOutput} from "./types/AnsibleOutput";

export class AnsiblePlaybookService {
    constructor(
        private envService: EnvService,
        private ansibleConfigFile: string,
    ) {
    }

    async run(playbookPath: string): Promise<AnsibleOutput> {
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

                try {
                    const output: AnsibleOutput = JSON.parse(stdout)
                    resolve(output);
                } catch (err) {
                    reject(`Ошибка парсинга JSON: ${err}\nstdout: ${stdout}`);
                    return;
                }
            });
        })
    }
}