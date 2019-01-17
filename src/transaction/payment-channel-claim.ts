import * as utils from './utils'
const ValidationError = utils.common.errors.ValidationError
const claimFlags = utils.common.txFlags.PaymentChannelClaim
import {validate, sunToDrops} from '../common'
import {Instructions, Prepare} from './types'

export type PaymentChannelClaim = {
  channel: string,
  balance?: string,
  amount?: string,
  signature?: string,
  publicKey?: string,
  renew?: boolean,
  close?: boolean
}

function createPaymentChannelClaimTransaction(account: string,
  claim: PaymentChannelClaim
): object {
  const txJSON: any = {
    Account: account,
    TransactionType: 'PaymentChannelClaim',
    Channel: claim.channel,
    Flags: 0
  }

  if (claim.balance !== undefined) {
    txJSON.Balance = sunToDrops(claim.balance)
  }
  if (claim.amount !== undefined) {
    txJSON.Amount = sunToDrops(claim.amount)
  }

  if (Boolean(claim.signature) !== Boolean(claim.publicKey)) {
    throw new ValidationError('"signature" and "publicKey" fields on'
      + ' PaymentChannelClaim must only be specified together.')
  }

  if (claim.signature !== undefined) {
    txJSON.Signature = claim.signature
  }
  if (claim.publicKey !== undefined) {
    txJSON.PublicKey = claim.publicKey
  }

  if (claim.renew === true && claim.close === true) {
    throw new ValidationError('"renew" and "close" flags on PaymentChannelClaim'
      + ' are mutually exclusive')
  }

  if (claim.renew === true) {
    txJSON.Flags |= claimFlags.Renew
  }
  if (claim.close === true) {
    txJSON.Flags |= claimFlags.Close
  }

  return txJSON
}

function preparePaymentChannelClaim(address: string,
  paymentChannelClaim: PaymentChannelClaim,
  instructions: Instructions = {}
): Promise<Prepare> {
  validate.preparePaymentChannelClaim(
    {address, paymentChannelClaim, instructions})
  const txJSON = createPaymentChannelClaimTransaction(
    address, paymentChannelClaim)
  return utils.prepareTransaction(txJSON, this, instructions)
}

export default preparePaymentChannelClaim
