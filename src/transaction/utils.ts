import BigNumber from 'bignumber.js'
import * as common from '../common'
import {Memo} from '../common/types/objects'
const txFlags = common.txFlags
import {Instructions, Prepare} from './types'
import {SunnycoinAPI} from '../api'
import {ValidationError} from '../common/errors'

export type ApiMemo = {
  MemoData?: string,
  MemoType?: string,
  MemoFormat?: string
}

function formatPrepareResponse(txJSON: any): Prepare {
  const instructions = {
    fee: common.dropsToSun(txJSON.Fee),
    sequence: txJSON.Sequence,
    maxLedgerVersion: txJSON.LastLedgerSequence === undefined ?
      null : txJSON.LastLedgerSequence
  }
  return {
    txJSON: JSON.stringify(txJSON),
    instructions
  }
}

function setCanonicalFlag(txJSON) {
  txJSON.Flags |= txFlags.Universal.FullyCanonicalSig

  // JavaScript converts operands to 32-bit signed ints before doing bitwise
  // operations. We need to convert it back to an unsigned int.
  txJSON.Flags = txJSON.Flags >>> 0
}

function scaleValue(value, multiplier, extra = 0) {
  return (new BigNumber(value)).times(multiplier).plus(extra).toString()
}

function prepareTransaction(txJSON: any, api: SunnycoinAPI,
  instructions: Instructions
): Promise<Prepare> {
  common.validate.instructions(instructions)

  const account = txJSON.Account
  setCanonicalFlag(txJSON)

  function prepareMaxLedgerVersion(): Promise<object> {
    if (instructions.maxLedgerVersion !== undefined) {
      if (instructions.maxLedgerVersion !== null) {
        txJSON.LastLedgerSequence = instructions.maxLedgerVersion
      }
      return Promise.resolve(txJSON)
    }
    const offset = instructions.maxLedgerVersionOffset !== undefined ?
      instructions.maxLedgerVersionOffset : 3
    return api.connection.getLedgerVersion().then(ledgerVersion => {
      txJSON.LastLedgerSequence = ledgerVersion + offset
      return txJSON
    })
  }

  function prepareFee(): Promise<object> {
    const multiplier = instructions.signersCount === undefined ? 1 :
      instructions.signersCount + 1
    if (instructions.fee !== undefined) {
      const fee = new BigNumber(instructions.fee)
      if (fee.greaterThan(api._maxFeeSUN)) {
        const errorMessage = `Fee of ${fee.toString(10)} SUN exceeds ` +
          `max of ${api._maxFeeSUN} SUN. To use this fee, increase ` +
          '`maxFeeSUN` in the SunnycoinAPI constructor.'
        throw new ValidationError(errorMessage)
      }
      txJSON.Fee = scaleValue(common.sunToDrops(instructions.fee), multiplier)
      return Promise.resolve(txJSON)
    }
    const cushion = api._feeCushion
    return api.getFee(cushion).then(fee => {
      return api.connection.getFeeRef().then(feeRef => {
        const extraFee =
          (txJSON.TransactionType !== 'EscrowFinish' ||
            txJSON.Fulfillment === undefined) ? 0 :
            (cushion * feeRef * (32 + Math.floor(
              new Buffer(txJSON.Fulfillment, 'hex').length / 16)))
        const feeDrops = common.sunToDrops(fee)
        const maxFeeSUN = instructions.maxFee ?
          BigNumber.min(api._maxFeeSUN, instructions.maxFee) : api._maxFeeSUN
        const maxFeeDrops = common.sunToDrops(maxFeeSUN)
        const normalFee = scaleValue(feeDrops, multiplier, extraFee)
        txJSON.Fee = BigNumber.min(normalFee, maxFeeDrops).toString(10)

        return txJSON
      })
    })
  }

  async function prepareSequence(): Promise<object> {
    if (instructions.sequence !== undefined) {
      txJSON.Sequence = instructions.sequence
      return Promise.resolve(txJSON)
    }
    const response = await api.request('account_info', {
      account: account as string
    })
    txJSON.Sequence = response.account_data.Sequence
    return txJSON
  }

  return Promise.all([
    prepareMaxLedgerVersion(),
    prepareFee(),
    prepareSequence()
  ]).then(() => formatPrepareResponse(txJSON))
}

function convertStringToHex(string: string): string {
return new Buffer(string, 'utf8').toString('hex').toUpperCase()
}

function convertMemo(memo: Memo): {Memo: ApiMemo} {
  return {
    Memo: common.removeUndefined({
      MemoData: memo.data ? convertStringToHex(memo.data) : undefined,
      MemoType: memo.type ? convertStringToHex(memo.type) : undefined,
      MemoFormat: memo.format ? convertStringToHex(memo.format) : undefined
    })
  }
}

export {
  convertStringToHex,
  convertMemo,
  prepareTransaction,
  common
}
