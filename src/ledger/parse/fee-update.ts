
import BigNumber from 'bignumber.js'
import {dropsToSun} from '../../common'

function parseFeeUpdate(tx: any) {
  const baseFeeDrops = (new BigNumber(tx.BaseFee, 16)).toString()
  return {
    baseFeeSUN: dropsToSun(baseFeeDrops),
    referenceFeeUnits: tx.ReferenceFeeUnits,
    reserveBaseSUN: dropsToSun(tx.ReserveBase),
    reserveIncrementSUN: dropsToSun(tx.ReserveIncrement)
  }
}

export default parseFeeUpdate
