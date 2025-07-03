import path from "path";
import {EnvService} from "./services/envService";
import {AnsiblePlaybookService} from "./services/ansiblePlaybookService";

export enum AllowedPlaybook {
    PrepareStand = 'prepare_stand',
    Main = 'main',
    CleanUpStand = 'clean_up_stand'
}

const playbookMap: Record<AllowedPlaybook, string> = {
    [AllowedPlaybook.PrepareStand]: path.join(__dirname, "ansible", "playbooks", "prepareStand.yml"),
    [AllowedPlaybook.Main]: path.join(__dirname, "ansible", "playbooks", "actualizeABS.yml"),
    [AllowedPlaybook.CleanUpStand]: path.join(__dirname, "ansible", "playbooks", "cleanUpStand.yml"),
}

const envService = new EnvService()
const ansibleConfigPath = path.resolve(__dirname, "ansible", "ansible.cfg");
const ansiblePlaybookService = new AnsiblePlaybookService(envService, ansibleConfigPath)

const start = async () => {
    for (const playbook of Object.values(AllowedPlaybook)) {
        console.log(`Running playbook: ${playbook}`)
        try {
            const path = playbookMap[playbook]
            const data = await ansiblePlaybookService.run(path)
            console.log(data)
        } catch (error) {
            console.error(`Error running playbook: ${playbook}`, error);
            break;
        }
    }
}

void start()