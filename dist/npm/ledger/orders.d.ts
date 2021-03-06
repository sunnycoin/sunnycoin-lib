import { FormattedAccountOrder } from './parse/account-order';
import { SunnycoinAPI } from '../api';
export declare type GetOrdersOptions = {
    limit?: number;
    ledgerVersion?: number;
};
export default function getOrders(this: SunnycoinAPI, address: string, options?: GetOrdersOptions): Promise<FormattedAccountOrder[]>;
