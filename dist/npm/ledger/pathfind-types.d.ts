import { Amount, SunnycoindAmount, Adjustment, MaxAdjustment, MinAdjustment } from '../common/types/objects';
export declare type LaxLaxAmount = {
    currency: string;
    value?: string;
    issuer?: string;
    counterparty?: string;
};
export declare type Path = {
    source: Adjustment | MaxAdjustment;
    destination: Adjustment | MinAdjustment;
    paths: string;
};
export declare type GetPaths = Array<Path>;
export declare type PathFind = {
    source: {
        address: string;
        amount?: Amount;
        currencies?: Array<{
            currency: string;
            counterparty?: string;
        }>;
    };
    destination: {
        address: string;
        amount: LaxLaxAmount;
    };
};
export declare type PathFindRequest = {
    command: string;
    source_account: string;
    destination_amount: SunnycoindAmount;
    destination_account: string;
    source_currencies?: {
        currency: string;
        issuer?: string;
    }[];
    send_max?: SunnycoindAmount;
};
export declare type SunnycoindPathsResponse = {
    alternatives: Array<{
        paths_computed: Array<Array<{
            type: number;
            type_hex: string;
            account?: string;
            issuer?: string;
            currency?: string;
        }>>;
        source_amount: SunnycoindAmount;
    }>;
    type: string;
    destination_account: string;
    destination_amount: SunnycoindAmount;
    destination_currencies?: Array<string>;
    source_account: string;
    source_currencies?: Array<{
        currency: string;
    }>;
    full_reply?: boolean;
};
