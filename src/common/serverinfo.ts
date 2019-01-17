import * as _ from 'lodash'
import {convertKeysFromSnakeCaseToCamelCase} from './utils'
import BigNumber from 'bignumber.js'
import {SunnycoinAPI} from '../index'

export type GetServerInfoResponse = {
  buildVersion: string,
  completeLedgers: string,
  hostID: string,
  ioLatencyMs: number,
  load?: {
    jobTypes: Array<object>,
    threads: number
  },
  lastClose: {
    convergeTimeS: number,
    proposers: number
  },
  loadFactor: number,
  peers: number,
  pubkeyNode: string,
  pubkeyValidator?: string,
  serverState: string,
  validatedLedger: {
    age: number,
    baseFeeSUN: string,
    hash: string,
    reserveBaseSUN: string,
    reserveIncrementSUN: string,
    ledgerVersion: number
  },
  validationQuorum: number
}

function renameKeys(object, mapping) {
  _.forEach(mapping, (to, from) => {
    object[to] = object[from]
    delete object[from]
  })
}

function getServerInfo(this: SunnycoinAPI): Promise<GetServerInfoResponse> {
  return this.request('server_info').then(response => {
    const info = convertKeysFromSnakeCaseToCamelCase(response.info)
    renameKeys(info, {hostid: 'hostID'})
    if (info.validatedLedger) {
      renameKeys(info.validatedLedger, {
        baseFeeSun: 'baseFeeSUN',
        reserveBaseSun: 'reserveBaseSUN',
        reserveIncSun: 'reserveIncrementSUN',
        seq: 'ledgerVersion'
      })
      info.validatedLedger.baseFeeSUN =
        info.validatedLedger.baseFeeSUN.toString()
      info.validatedLedger.reserveBaseSUN =
        info.validatedLedger.reserveBaseSUN.toString()
      info.validatedLedger.reserveIncrementSUN =
        info.validatedLedger.reserveIncrementSUN.toString()
    }
    return info
  })
}

// This is a public API that can be called directly.
// This is not used by the `prepare*` methods. See `src/transaction/utils.ts`
async function getFee(
  this: SunnycoinAPI,
  cushion?: number
): Promise<string> {
  if (cushion === undefined) {
    cushion = this._feeCushion
  }
  if (cushion === undefined) {
    cushion = 1.2
  }

  const serverInfo = (await this.request('server_info')).info
  const baseFeeSun = new BigNumber(serverInfo.validated_ledger.base_fee_sun)
  let fee = baseFeeSun.times(serverInfo.load_factor).times(cushion)

  // Cap fee to `this._maxFeeSUN`
  fee = BigNumber.min(fee, this._maxFeeSUN)
  // Round fee to 6 decimal places
  return (new BigNumber(fee.toFixed(6))).toString(10)
}

export {
  getServerInfo,
  getFee
}
