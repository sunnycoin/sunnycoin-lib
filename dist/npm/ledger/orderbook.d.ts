import { FormattedOrderbookOrder } from './parse/orderbook-order';
import { Issue } from '../common/types/objects';
import { BookOffer } from '../common/types/commands';
import { SunnycoinAPI } from '../api';
export declare type FormattedOrderbook = {
    bids: FormattedOrderbookOrder[];
    asks: FormattedOrderbookOrder[];
};
export declare function formatBidsAndAsks(orderbook: OrderbookInfo, offers: BookOffer[]): {
    bids: FormattedOrderbookOrder[];
    asks: FormattedOrderbookOrder[];
};
export declare type GetOrderbookOptions = {
    limit?: number;
    ledgerVersion?: number;
};
export declare type OrderbookInfo = {
    base: Issue;
    counter: Issue;
};
export declare function getOrderbook(this: SunnycoinAPI, address: string, orderbook: OrderbookInfo, options?: GetOrderbookOptions): Promise<FormattedOrderbook>;
