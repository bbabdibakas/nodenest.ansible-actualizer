import {AnsibleOutput} from "./types/AnsibleOutput";

export class ReportService {
    constructor() {
    }

    build(data: AnsibleOutput) {
        const unreachableServers: string[] = []

        for (const play of data.plays) {
            for (const task of play.tasks) {
                console.log('TASK: ',task.task.name);

                if (task.task.name === 'Check if host available for connection') {
                    for (const [host, result] of Object.entries(task.hosts)) {
                        if (result.unreachable) {
                            unreachableServers.push(host)
                        }
                    }
                }

                if (task.task.name === 'Print dialog360 health status') {
                    for (const [host, result] of Object.entries(task.hosts)) {
                        console.log(result.msg)
                    }
                }
            }
        }

        console.log(unreachableServers)
    }
}