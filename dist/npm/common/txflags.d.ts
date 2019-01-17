declare const txFlags: {
    Universal: {
        FullyCanonicalSig: number;
    };
    AccountSet: {
        RequireDestTag: number;
        OptionalDestTag: number;
        RequireAuth: number;
        OptionalAuth: number;
        DisallowSUN: number;
        AllowSUN: number;
    };
    TrustSet: {
        SetAuth: number;
        NoSunnycoin: number;
        SetNoSunnycoin: number;
        ClearNoSunnycoin: number;
        SetFreeze: number;
        ClearFreeze: number;
    };
    OfferCreate: {
        Passive: number;
        ImmediateOrCancel: number;
        FillOrKill: number;
        Sell: number;
    };
    Payment: {
        NoSunnycoinDirect: number;
        PartialPayment: number;
        LimitQuality: number;
    };
    PaymentChannelClaim: {
        Renew: number;
        Close: number;
    };
};
declare const txFlagIndices: {
    AccountSet: {
        asfRequireDest: number;
        asfRequireAuth: number;
        asfDisallowSUN: number;
        asfDisableMaster: number;
        asfAccountTxnID: number;
        asfNoFreeze: number;
        asfGlobalFreeze: number;
        asfDefaultSunnycoin: number;
        asfDepositAuth: number;
    };
};
export { txFlags, txFlagIndices };
