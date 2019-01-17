import * as _ from 'lodash'
import {removeUndefined, sunnycoinTimeToISO8601} from '../../common'
import parseTransaction from './transaction'
import {Ledger} from '../../common/types/objects'

export type FormattedLedger = {
  // TODO: properties in type don't match response object. Fix!
  // accepted: boolean,
  // closed: boolean,
  stateHash: string,
  closeTime: string,
  closeTimeResolution: number,
  closeFlags: number,
  ledgerHash: string,
  ledgerVersion: number,
  parentLedgerHash: string,
  parentCloseTime: string,
  totalDrops: string,
  transactionHash: string,
  transactions?: Array<object>,
  transactionHashes?: Array<string>,
  rawState?: string,
  stateHashes?: Array<string>
}

function parseTransactionWrapper(ledgerVersion, tx) {
  // renames metaData to meta and adds ledger_index
  const transaction = _.assign({}, _.omit(tx, 'metaData'), {
    meta: tx.metaData,
    ledger_index: ledgerVersion
  })
  const result = parseTransaction(transaction, true)
  if (!result.outcome.ledgerVersion) {
    result.outcome.ledgerVersion = ledgerVersion
  }
  return result
}

function parseTransactions(transactions, ledgerVersion) {
  if (_.isEmpty(transactions)) {
    return {}
  }
  if (_.isString(transactions[0])) {
    return {transactionHashes: transactions}
  }
  return {
    transactions: _.map(transactions,
      _.partial(parseTransactionWrapper, ledgerVersion))
  }
}

function parseState(state) {
  if (_.isEmpty(state)) {
    return {}
  }
  if (_.isString(state[0])) {
    return {stateHashes: state}
  }
  return {rawState: JSON.stringify(state)}
}

export function parseLedger(ledger: Ledger): FormattedLedger {
  const ledgerVersion = parseInt(ledger.ledger_index || ledger.seqNum, 10)
  return removeUndefined(Object.assign(
    {
      stateHash: ledger.account_hash,
      closeTime: sunnycoinTimeToISO8601(ledger.close_time),
      closeTimeResolution: ledger.close_time_resolution,
      closeFlags: ledger.close_flags,
      ledgerHash: ledger.hash || ledger.ledger_hash,
      ledgerVersion: ledgerVersion,
      parentLedgerHash: ledger.parent_hash,
      parentCloseTime: sunnycoinTimeToISO8601(ledger.parent_close_time),
      totalDrops: ledger.total_coins || ledger.totalCoins,
      transactionHash: ledger.transaction_hash
    },
    parseTransactions(ledger.transactions, ledgerVersion),
    parseState(ledger.accountState)
  ))
}
