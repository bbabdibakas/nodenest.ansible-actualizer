import {AnsibleOutput} from "./types/AnsibleOutput";
import {Report} from "./types/Report";

export class ReportService {
    constructor() {
    }

    build(data: AnsibleOutput) {
        const report: Report[] = []

        for (const play of data.plays) {
            for (const task of play.tasks) {
                if (task.task.name === 'Check if host available for connection') {
                    for (const [host, result] of Object.entries(task.hosts)) {
                        if (result.unreachable) {
                            report.push({
                                name: host,
                                isUnreachable: true,
                                healthStatus: null
                            })
                        }
                    }
                }

                if (task.task.name === 'Debug health_status response') {
                    for (const [host, result] of Object.entries(task.hosts)) {
                        report.push({
                            name: host,
                            isUnreachable: false,
                            healthStatus: {
                                status: result.health_check_response.status,
                                data: result.health_check_response.json
                            }
                        })
                    }
                }
            }
        }

        return report
    }
}