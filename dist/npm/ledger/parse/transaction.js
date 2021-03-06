"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const common_1 = require("../../common");
const payment_1 = require("./payment");
const trustline_1 = require("./trustline");
const order_1 = require("./order");
const cancellation_1 = require("./cancellation");
const settings_1 = require("./settings");
const escrow_creation_1 = require("./escrow-creation");
const escrow_execution_1 = require("./escrow-execution");
const escrow_cancellation_1 = require("./escrow-cancellation");
const check_create_1 = require("./check-create");
const check_cash_1 = require("./check-cash");
const check_cancel_1 = require("./check-cancel");
const deposit_preauth_1 = require("./deposit-preauth");
const payment_channel_create_1 = require("./payment-channel-create");
const payment_channel_fund_1 = require("./payment-channel-fund");
const payment_channel_claim_1 = require("./payment-channel-claim");
const fee_update_1 = require("./fee-update");
const amendment_1 = require("./amendment");
function parseTransactionType(type) {
    // Ordering matches https://developers.sunnycoin.com/transaction-types.html
    const mapping = {
        AccountSet: 'settings',
        CheckCancel: 'checkCancel',
        CheckCash: 'checkCash',
        CheckCreate: 'checkCreate',
        DepositPreauth: 'depositPreauth',
        EscrowCancel: 'escrowCancellation',
        EscrowCreate: 'escrowCreation',
        EscrowFinish: 'escrowExecution',
        OfferCancel: 'orderCancellation',
        OfferCreate: 'order',
        Payment: 'payment',
        PaymentChannelClaim: 'paymentChannelClaim',
        PaymentChannelCreate: 'paymentChannelCreate',
        PaymentChannelFund: 'paymentChannelFund',
        SetRegularKey: 'settings',
        SignerListSet: 'settings',
        TrustSet: 'trustline',
        EnableAmendment: 'amendment',
        SetFee: 'feeUpdate' // pseudo-transaction
    };
    return mapping[type] || null;
}
// includeRawTransaction: undefined by default (getTransaction)
function parseTransaction(tx, includeRawTransaction) {
    const type = parseTransactionType(tx.TransactionType);
    const mapping = {
        'payment': payment_1.default,
        'trustline': trustline_1.default,
        'order': order_1.default,
        'orderCancellation': cancellation_1.default,
        'settings': settings_1.default,
        'escrowCreation': escrow_creation_1.default,
        'escrowExecution': escrow_execution_1.default,
        'escrowCancellation': escrow_cancellation_1.default,
        'checkCreate': check_create_1.default,
        'checkCash': check_cash_1.default,
        'checkCancel': check_cancel_1.default,
        'depositPreauth': deposit_preauth_1.default,
        'paymentChannelCreate': payment_channel_create_1.default,
        'paymentChannelFund': payment_channel_fund_1.default,
        'paymentChannelClaim': payment_channel_claim_1.default,
        'feeUpdate': fee_update_1.default,
        'amendment': amendment_1.default
    };
    const parser = mapping[type];
    const specification = parser ? parser(tx) : {
        UNAVAILABLE: 'Unrecognized transaction type.',
        SEE_RAW_TRANSACTION: 'Since this type is unrecognized, `rawTransaction` is included in this response.'
    };
    if (!parser) {
        includeRawTransaction = true;
    }
    const outcome = utils_1.parseOutcome(tx);
    return common_1.removeUndefined({
        type: type,
        address: tx.Account,
        sequence: tx.Sequence,
        id: tx.hash,
        specification: common_1.removeUndefined(specification),
        outcome: outcome ? common_1.removeUndefined(outcome) : undefined,
        rawTransaction: includeRawTransaction ? JSON.stringify(tx) : undefined
    });
}
exports.default = parseTransaction;
//# sourceMappingURL=transaction.js.map