import path from "path";
import {EnvService} from "./services/envService";
import {AnsiblePlaybookService} from "./services/ansiblePlaybookService";
import {ReportService} from "./services/reportService";
import {Report} from "./services/types/Report";

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
const reportService = new ReportService()

const start = async () => {
    let report: Report[] = []

    for (const playbook of Object.values(AllowedPlaybook)) {
        console.log(`Running playbook: ${playbook}..`)
        try {
            const path = playbookMap[playbook]
            const data = await ansiblePlaybookService.run(path)

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