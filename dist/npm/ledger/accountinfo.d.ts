import { SunnycoinAPI } from '../api';
export declare type GetAccountInfoOptions = {
    ledgerVersion?: number;
};
export declare type FormattedGetAccountInfoResponse = {
    sequence: number;
    sunBalance: string;
    ownerCount: number;
    previousInitiatedTransactionID: string;
    previousAffectingTransactionID: string;
    previousAffectingTransactionLedgerVersion: number;
};
export default function getAccountInfo(this: SunnycoinAPI, address: string, options?: GetAccountInfoOptions): Promise<FormattedGetAccountInfoResponse>;
