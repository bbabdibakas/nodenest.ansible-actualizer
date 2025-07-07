import {AnsibleOutput} from "./types/AnsibleOutput";
import {HetznerServer} from "./types/HetznerServer";

export class ReportService {
    constructor() {
    }

    build(data: AnsibleOutput, servers: HetznerServer[]) {
        for (const play of data.plays) {
            for (const task of play.tasks) {
                if (task.task.name === 'Check if host available for connection') {
                    for (const [host, result] of Object.entries(task.hosts)) {
                        if (result.unreachable) {
                            const server = servers.find(s => s.name === host);
                            if (server) {
                                server.isUnreachable = result.unreachable
                            }
                        }
                    }
                }

                if (task.task.name === 'Debug config_file') {
                    for (const [host, result] of Object.entries(task.hosts)) {
                        const server = servers.find(s => s.name === host);
                        if (result.config_file.stat.exists) {
                            if (server) {
                                server.isConfigFileExists = result.config_file.stat.exists
                            }
                        }
                    }
                }


                if (task.task.name === 'Debug health_status response') {
                    for (const [host, result] of Object.entries(task.hosts)) {
                        const server = servers.find(s => s.name === host);
                        if (server) {
                            server.wabaHealthStatusCode = result.health_check_response.status
                        }
                    }
                }
            }
        }

        return servers
    }
}