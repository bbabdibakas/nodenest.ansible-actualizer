export type HostResult = {
    changed?: boolean;
    rc?: number;
    stdout?: string;
    stderr?: string;
    failed?: boolean;
    unreachable?: boolean;
    msg?: string;
    [key: string]: any;
};

export type HostsResult = Record<string, HostResult>;

interface TaskResult {
    duration: {
        end: Date;
        start: Date;
    },
    id: string
    name: string,
    path: string
}

interface Play {
    play: TaskResult;
    tasks: {
        hosts: HostsResult,
        task: TaskResult
    }[]
}

export interface AnsibleOutput {
    custom_stats: {},
    global_custom_stats: {},
    plays: Play[],
    stats: {
        [hostname: string]: {
            changed: number;
            failures: number;
            ok: number;
            skipped: number;
            unreachable: number;
        }
    }
}