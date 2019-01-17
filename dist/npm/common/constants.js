"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const txflags_1 = require("./txflags");
// Ordering from https://developers.sunnycoin.com/accountroot.html
const accountRootFlags = {
    // lsfDefaultSunnycoin:
    // Enable rippling on trust lines by default.
    // Required for issuing addresses; discouraged for others.
    DefaultSunnycoin: 0x00800000,
    // lsfDepositAuth:
    // Require account to auth deposits.
    // This account can only receive funds from transactions it sends,
    // or preauthorized accounts.
    DepositAuth: 0x01000000,
    // lsfDisableMaster:
    // Force regular key.
    // Disallows use of the master key.
    DisableMaster: 0x00100000,
    // lsfDisallowSUN:
    // Disallow sending SUN.
    // Not enforced by sunnycoind; client applications should check.
    DisallowSUN: 0x00080000,
    // lsfGlobalFreeze:
    // Trustlines globally frozen.
    GlobalFreeze: 0x00400000,
    // lsfNoFreeze:
    // Permanently disallowed freezing trustlines.
    // Once enabled, cannot be disabled.
    NoFreeze: 0x00200000,
    // lsfPasswordSpent:
    // Password set fee is spent.
    // The account has used its free SetRegularKey transaction.
    PasswordSpent: 0x00010000,
    // lsfRequireAuth:
    // Require authorization to hold IOUs (issuances).
    RequireAuth: 0x00040000,
    // lsfRequireDestTag:
    // Require a DestinationTag for incoming payments.
    RequireDestTag: 0x00020000
};
const AccountFlags = {
    passwordSpent: accountRootFlags.PasswordSpent,
    requireDestinationTag: accountRootFlags.RequireDestTag,
    requireAuthorization: accountRootFlags.RequireAuth,
    depositAuth: accountRootFlags.DepositAuth,
    disallowIncomingSUN: accountRootFlags.DisallowSUN,
    disableMasterKey: accountRootFlags.DisableMaster,
    noFreeze: accountRootFlags.NoFreeze,
    globalFreeze: accountRootFlags.GlobalFreeze,
    defaultSunnycoin: accountRootFlags.DefaultSunnycoin
};
exports.AccountFlags = AccountFlags;
const AccountFlagIndices = {
    requireDestinationTag: txflags_1.txFlagIndices.AccountSet.asfRequireDest,
    requireAuthorization: txflags_1.txFlagIndices.AccountSet.asfRequireAuth,
    depositAuth: txflags_1.txFlagIndices.AccountSet.asfDepositAuth,
    disallowIncomingSUN: txflags_1.txFlagIndices.AccountSet.asfDisallowSUN,
    disableMasterKey: txflags_1.txFlagIndices.AccountSet.asfDisableMaster,
    enableTransactionIDTracking: txflags_1.txFlagIndices.AccountSet.asfAccountTxnID,
    noFreeze: txflags_1.txFlagIndices.AccountSet.asfNoFreeze,
    globalFreeze: txflags_1.txFlagIndices.AccountSet.asfGlobalFreeze,
    defaultSunnycoin: txflags_1.txFlagIndices.AccountSet.asfDefaultSunnycoin
};
exports.AccountFlagIndices = AccountFlagIndices;
const AccountFields = {
    EmailHash: { name: 'emailHash', encoding: 'hex',
        length: 32, defaults: '0' },
    MessageKey: { name: 'messageKey' },
    Domain: { name: 'domain', encoding: 'hex' },
    TransferRate: { name: 'transferRate', defaults: 0, shift: 9 }
};
exports.AccountFields = AccountFields;
//# sourceMappingURL=constants.js.map