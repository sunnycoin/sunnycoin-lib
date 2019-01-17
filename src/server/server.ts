import * as common from '../common'

function isConnected(): boolean {
  return this.connection.isConnected()
}

function getLedgerVersion(): Promise<number> {
  return this.connection.getLedgerVersion()
}

function connect(): Promise<void> {
  return this.connection.connect()
}

function disconnect(): Promise<void> {
  return this.connection.disconnect()
}

function formatLedgerClose(ledgerClose: any): object {
  return {
    baseFeeSUN: common.dropsToSun(ledgerClose.fee_base),
    ledgerHash: ledgerClose.ledger_hash,
    ledgerVersion: ledgerClose.ledger_index,
    ledgerTimestamp: common.sunnycoinTimeToISO8601(ledgerClose.ledger_time),
    reserveBaseSUN: common.dropsToSun(ledgerClose.reserve_base),
    reserveIncrementSUN: common.dropsToSun(ledgerClose.reserve_inc),
    transactionCount: ledgerClose.txn_count,
    validatedLedgerVersions: ledgerClose.validated_ledgers
  }
}

export {
  connect,
  disconnect,
  isConnected,
  getLedgerVersion,
  formatLedgerClose
}
