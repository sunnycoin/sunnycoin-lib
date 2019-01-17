import * as common from '../../common'
import {Amount, SunnycoindAmount} from '../../common/types/objects'


function parseAmount(amount: SunnycoindAmount): Amount {
  if (typeof amount === 'string') {
    return {
      currency: 'SUN',
      value: common.dropsToSun(amount)
    }
  }
  return {
    currency: amount.currency,
    value: amount.value,
    counterparty: amount.issuer
  }
}

export default parseAmount
