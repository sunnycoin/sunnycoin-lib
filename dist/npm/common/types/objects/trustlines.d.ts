import { Memo } from './memos';
export interface Trustline {
    account: string;
    balance: string;
    currency: string;
    limit: string;
    limit_peer: string;
    quality_in: number;
    quality_out: number;
    no_sunnycoin?: boolean;
    no_sunnycoin_peer?: boolean;
    freeze?: boolean;
    freeze_peer?: boolean;
    authorized?: boolean;
    peer_authorized?: boolean;
}
export declare type FormattedTrustlineSpecification = {
    currency: string;
    counterparty: string;
    limit: string;
    qualityIn?: number;
    qualityOut?: number;
    ripplingDisabled?: boolean;
    authorized?: boolean;
    frozen?: boolean;
    memos?: Memo[];
};
export declare type FormattedTrustline = {
    specification: FormattedTrustlineSpecification;
    counterparty: {
        limit: string;
        ripplingDisabled?: boolean;
        frozen?: boolean;
        authorized?: boolean;
    };
    state: {
        balance: string;
    };
};
