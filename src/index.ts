import path from "path";
import {EnvService} from "./services/envService";
import {AnsibleService, AnsibleServicePaths} from "./services/ansibleService";
import {ReportService} from "./services/reportService";
import {ApiService} from "./services/apiService";

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

const ansibleServicePaths: AnsibleServicePaths = {
    inventory: path.resolve(__dirname, "ansible", "inventories", "actualize.ini"),
    privateKey: path.resolve(__dirname, "ansible", "playbooks", "tmp", "id_rsa"),
    config: path.resolve(__dirname, "ansible", "ansible.cfg")
}

const envService = new EnvService()
const ansibleService = new AnsibleService(envService, ansibleServicePaths)
const apiService = new ApiService(envService)
const reportService = new ReportService()

const start = async () => {
    let hosts = await apiService.getServers()
    ansibleService.buildInventoryFile(hosts)

    for (const playbook of Object.values(AllowedPlaybook)) {
        console.log(`Running playbook: ${playbook}..`)
        try {
            const path = playbookMap[playbook]
            const data = await ansibleService.runPlaybook(path)

            if (playbook === AllowedPlaybook.Main) {
                hosts = reportService.build(data, hosts)
            }
        } catch (error) {
            console.error(`Error running playbook: ${playbook}`, error);
            break;
        }
    }

    console.log(hosts)
}

void start()