import path from "path";
import {runAnsiblePlaybook} from "./services/runAnsiblePlaybook";

const start = async () => {
    const playbookPath = path.join(__dirname, "ansible", "playbooks", "actualizeABS.yml");
    const ansibleConfig = path.join(__dirname, "ansible", "ansible.cfg");

    try {
        const data = await runAnsiblePlaybook(playbookPath, ansibleConfig);
        console.log(data)
    } catch (error) {
        console.error('Ошибка при запуске ansible:', error);
    }
}

void start()