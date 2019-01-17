import { SunnycoinAPI } from './api';
declare class SunnycoinAPIBroadcast extends SunnycoinAPI {
    ledgerVersion: number | undefined;
    private _apis;
    constructor(servers: any, options: any);
    onLedgerEvent(ledger: any): void;
    getMethodNames(): string[];
}
export { SunnycoinAPIBroadcast };
