import { SunnycoinAPI } from '../index';
export declare type GetServerInfoResponse = {
    buildVersion: string;
    completeLedgers: string;
    hostID: string;
    ioLatencyMs: number;
    load?: {
        jobTypes: Array<object>;
        threads: number;
    };
    lastClose: {
        convergeTimeS: number;
        proposers: number;
    };
    loadFactor: number;
    peers: number;
    pubkeyNode: string;
    pubkeyValidator?: string;
    serverState: string;
    validatedLedger: {
        age: number;
        baseFeeSUN: string;
        hash: string;
        reserveBaseSUN: string;
        reserveIncrementSUN: string;
        ledgerVersion: number;
    };
    validationQuorum: number;
};
declare function getServerInfo(this: SunnycoinAPI): Promise<GetServerInfoResponse>;
declare function getFee(this: SunnycoinAPI, cushion?: number): Promise<string>;
export { getServerInfo, getFee };
