"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common = require("../common");
function isConnected() {
    return this.connection.isConnected();
}
exports.isConnected = isConnected;
function getLedgerVersion() {
    return this.connection.getLedgerVersion();
}
exports.getLedgerVersion = getLedgerVersion;
function connect() {
    return this.connection.connect();
}
exports.connect = connect;
function disconnect() {
    return this.connection.disconnect();
}
exports.disconnect = disconnect;
function formatLedgerClose(ledgerClose) {
    return {
        baseFeeSUN: common.dropsToSun(ledgerClose.fee_base),
        ledgerHash: ledgerClose.ledger_hash,
        ledgerVersion: ledgerClose.ledger_index,
        ledgerTimestamp: common.sunnycoinTimeToISO8601(ledgerClose.ledger_time),
        reserveBaseSUN: common.dropsToSun(ledgerClose.reserve_base),
        reserveIncrementSUN: common.dropsToSun(ledgerClose.reserve_inc),
        transactionCount: ledgerClose.txn_count,
        validatedLedgerVersions: ledgerClose.validated_ledgers
    };
}
exports.formatLedgerClose = formatLedgerClose;
//# sourceMappingURL=server.js.map