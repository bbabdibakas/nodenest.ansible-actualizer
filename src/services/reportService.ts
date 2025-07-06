import {AnsibleOutput} from "./types/AnsibleOutput";

export interface Report {
    name: string;
    isUnreachable: boolean;
    healthStatus: {
        status: number;
        data: any;
    } | null
}

export class ReportService {
    private readonly report: Report[]

    constructor() {
        this.report = []
    }

    build(data: AnsibleOutput) {
        for (const play of data.plays) {
            for (const task of play.tasks) {
                if (task.task.name === 'Check if host available for connection') {
                    for (const [host, result] of Object.entries(task.hosts)) {
                        if (result.unreachable) {
                            this.report.push({
                                name: host,
                                isUnreachable: true,
                                healthStatus: null
                            })
                        }
                    }
                }

                if (task.task.name === 'Debug dialog360.use') {
                    for (const [host, result] of Object.entries(task.hosts)) {
                        if (!result.dialog_use) {
                            this.report.push({
                                name: host,
                                isUnreachable: false,
                                healthStatus: null
                            })
                        }
                    }
                }

                if (task.task.name === 'Debug health_status response') {
                    for (const [host, result] of Object.entries(task.hosts)) {
                        this.report.push({
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

        return this.report
    }
}