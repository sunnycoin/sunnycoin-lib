import {parseTimestamp} from './utils'
import {removeUndefined, dropsToSun} from '../../common'
import {PayChannelLedgerEntry} from '../../common/types/objects'

export type FormattedPaymentChannel = {
  account: string,
  balance: string,
  publicKey: string,
  destination: string,
  settleDelay: number,
  expiration?: string,
  cancelAfter?: string,
  sourceTag?: number,
  destinationTag?: number,
  previousAffectingTransactionID: string,
  previousAffectingTransactionLedgerVersion: number
}

export function parsePaymentChannel(
  data: PayChannelLedgerEntry
): FormattedPaymentChannel {
  return removeUndefined({
    account: data.Account,
    amount: dropsToSun(data.Amount),
    balance: dropsToSun(data.Balance),
    destination: data.Destination,
    publicKey: data.PublicKey,
    settleDelay: data.SettleDelay,
    expiration: parseTimestamp(data.Expiration),
    cancelAfter: parseTimestamp(data.CancelAfter),
    sourceTag: data.SourceTag,
    destinationTag: data.DestinationTag,
    previousAffectingTransactionID: data.PreviousTxnID,
    previousAffectingTransactionLedgerVersion: data.PreviousTxnLgrSeq
  })
}
