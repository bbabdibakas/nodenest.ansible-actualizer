import path from "path";
import {EnvService} from "./services/envService";
import {AnsiblePlaybookService} from "./services/ansiblePlaybookService";

const prepareStandPlaybookPath = path.join(__dirname, "ansible", "playbooks", "prepareStand.yml");
const mainPlaybookPath = path.join(__dirname, "ansible", "playbooks", "actualizeABS.yml");
const cleanUpStandPlaybookPath = path.join(__dirname, "ansible", "playbooks", "cleanUpStand.yml");
const ansibleConfig = path.join(__dirname, "ansible", "ansible.cfg");

const envService = new EnvService()
const prepareStandPlaybookService = new AnsiblePlaybookService(envService, prepareStandPlaybookPath, ansibleConfig)
const mainPlaybookService = new AnsiblePlaybookService(envService, mainPlaybookPath, ansibleConfig)
const cleanUpStandPlaybookService = new AnsiblePlaybookService(envService, cleanUpStandPlaybookPath, ansibleConfig)

const start = async () => {
    try {
        const data1 = await prepareStandPlaybookService.run();
        console.log(data1)
        const data2 = await mainPlaybookService.run();
        console.log(data2)
        const data3 = await cleanUpStandPlaybookService.run();
        console.log(data3)
    } catch (error) {
        console.error('Ошибка при запуске ansible:', error);
    }
}

void start()