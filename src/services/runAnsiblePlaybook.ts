import {exec} from 'child_process';

export const runAnsiblePlaybook = (
    playbookPath: string,
    ansibleConfigFile: string,
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const command = `ansible-playbook ${playbookPath}`;
        const env = {
            ...process.env,
            ANSIBLE_CONFIG: ansibleConfigFile
        }

        exec(command, {env}, (error, stdout, stderr) => {
            if (error) {
                reject(`Ошибка: ${error.message}\nstdout: ${stdout}\nstderr: ${stderr}`);
                return;
            }

            resolve(stdout);
        })
    })
}
