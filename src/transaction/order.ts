import * as _ from 'lodash'
import * as utils from './utils'
const offerFlags = utils.common.txFlags.OfferCreate
import {validate, iso8601ToSunnycoinTime} from '../common'
import {Instructions, Prepare, OfferCreateTransaction} from './types'
import {FormattedOrderSpecification} from '../common/types/objects/index'

function createOrderTransaction(
  account: string, order: FormattedOrderSpecification
): OfferCreateTransaction {
  const takerPays = utils.common.toSunnycoindAmount(order.direction === 'buy' ?
    order.quantity : order.totalPrice)
  const takerGets = utils.common.toSunnycoindAmount(order.direction === 'buy' ?
    order.totalPrice : order.quantity)

  const txJSON: Partial<OfferCreateTransaction> = {
    TransactionType: 'OfferCreate',
    Account: account,
    TakerGets: takerGets,
    TakerPays: takerPays,
    Flags: 0
  }
  if (order.direction === 'sell') {
    txJSON.Flags |= offerFlags.Sell
  }
  if (order.passive === true) {
    txJSON.Flags |= offerFlags.Passive
  }
  if (order.immediateOrCancel === true) {
    txJSON.Flags |= offerFlags.ImmediateOrCancel
  }
  if (order.fillOrKill === true) {
    txJSON.Flags |= offerFlags.FillOrKill
  }
  if (order.expirationTime !== undefined) {
    txJSON.Expiration = iso8601ToSunnycoinTime(order.expirationTime)
  }
  if (order.orderToReplace !== undefined) {
    txJSON.OfferSequence = order.orderToReplace
  }
  if (order.memos !== undefined) {
    txJSON.Memos = _.map(order.memos, utils.convertMemo)
  }
  return txJSON as OfferCreateTransaction
}

function prepareOrder(address: string, order: FormattedOrderSpecification,
  instructions: Instructions = {}
): Promise<Prepare> {
  validate.prepareOrder({address, order, instructions})
  const txJSON = createOrderTransaction(address, order)
  return utils.prepareTransaction(txJSON, this, instructions)
}

export default prepareOrder
