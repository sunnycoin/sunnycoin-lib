import { Memo } from './memos';
export declare type WeightedSigner = {
    address: string;
    weight: number;
};
export declare type Signers = {
    threshold?: number;
    weights: WeightedSigner[];
};
export declare type FormattedSettings = {
    defaultSunnycoin?: boolean;
    depositAuth?: boolean;
    disableMasterKey?: boolean;
    disallowIncomingSUN?: boolean;
    domain?: string;
    emailHash?: string | null;
    enableTransactionIDTracking?: boolean;
    globalFreeze?: boolean;
    memos?: Memo[];
    messageKey?: string;
    noFreeze?: boolean;
    passwordSpent?: boolean;
    regularKey?: string;
    requireAuthorization?: boolean;
    requireDestinationTag?: boolean;
    signers?: Signers;
    transferRate?: number | null;
};
