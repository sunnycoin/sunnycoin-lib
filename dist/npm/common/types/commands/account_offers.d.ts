import { SunnycoindAmount } from '../objects';
export interface AccountOffersRequest {
    account: string;
    ledger_hash?: string;
    ledger_index?: number | ('validated' | 'closed' | 'current');
    limit?: number;
    marker?: any;
}
export interface AccountOffersResponse {
    account: string;
    ledger_hash?: string;
    ledger_current_index?: number;
    ledger_index?: number;
    marker?: any;
    offers?: AccountOffer[];
}
export interface AccountOffer {
    seq: number;
    flags: number;
    taker_gets: SunnycoindAmount;
    taker_pays: SunnycoindAmount;
    quality: string;
    expiration?: number;
}
