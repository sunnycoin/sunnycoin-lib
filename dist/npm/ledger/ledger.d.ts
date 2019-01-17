import { FormattedLedger } from './parse/ledger';
import { SunnycoinAPI } from '../api';
export declare type GetLedgerOptions = {
    ledgerHash?: string;
    ledgerVersion?: number;
    includeAllData?: boolean;
    includeTransactions?: boolean;
    includeState?: boolean;
};
declare function getLedger(this: SunnycoinAPI, options?: GetLedgerOptions): Promise<FormattedLedger>;
export default getLedger;
