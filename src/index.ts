import path from "path";
import {EnvService} from "./services/envService";
import {AnsibleService, AnsibleServicePaths} from "./services/ansibleService";
import {Report, ReportService} from "./services/reportService";

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
const reportService = new ReportService()

const start = async () => {
    let report: Report[] = []

    const hosts = [
        {
            name: "chat-bot1088",
            ip: "116.203.235.155"
        },
        {
            name: "chat-bot1053",
            ip: "78.46.192.5"
        },
        {
            name: "chat-bot10666",
            ip: "78.1.11.11"
        },
        {
            name: "chat-bot1005m1",
            ip: "78.46.182.173"
        }
    ]
    ansibleService.buildInventoryFile(hosts)

    for (const playbook of Object.values(AllowedPlaybook)) {
        console.log(`Running playbook: ${playbook}..`)
        try {
            const path = playbookMap[playbook]
            const data = await ansibleService.runPlaybook(path)

            if (playbook === AllowedPlaybook.Main) {
                report = reportService.build(data)
            }
        } catch (error) {
            console.error(`Error running playbook: ${playbook}`, error);
            break;
        }
    }

    console.log(report)
}

void start()