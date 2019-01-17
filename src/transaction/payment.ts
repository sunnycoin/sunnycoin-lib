import * as _ from 'lodash'
import * as utils from './utils'
const validate = utils.common.validate
const toSunnycoindAmount = utils.common.toSunnycoindAmount
const paymentFlags = utils.common.txFlags.Payment
const ValidationError = utils.common.errors.ValidationError
import {Instructions, Prepare} from './types'
import {Amount, Adjustment, MaxAdjustment,
  MinAdjustment, Memo} from '../common/types/objects'
import {sunToDrops} from '../common'


export interface Payment {
  source: Adjustment | MaxAdjustment,
  destination: Adjustment | MinAdjustment,
  paths?: string,
  memos?: Array<Memo>,
  // A 256-bit hash that can be used to identify a particular payment
  invoiceID?: string,
  // A boolean that, if set to true, indicates that this payment should go
  // through even if the whole amount cannot be delivered because of a lack of
  // liquidity or funds in the source_account account
  allowPartialPayment?: boolean,
  // A boolean that can be set to true if paths are specified and the sender
  // would like the Sunnycoin Network to disregard any direct paths from
  // the source_account to the destination_account. This may be used to take
  // advantage of an arbitrage opportunity or by gateways wishing to issue
  // balances from a hot wallet to a user who has mistakenly set a trustline
  // directly to the hot wallet
  noDirectSunnycoin?: boolean,
  limitQuality?: boolean
}

function isMaxAdjustment(
  source: Adjustment | MaxAdjustment): source is MaxAdjustment {
    return (source as MaxAdjustment).maxAmount !== undefined
}

function isMinAdjustment(
  destination: Adjustment | MinAdjustment): destination is MinAdjustment {
    return (destination as MinAdjustment).minAmount !== undefined
}

function isSUNToSUNPayment(payment: Payment): boolean {
  const {source, destination} = payment
  const sourceCurrency = isMaxAdjustment(source)
      ? source.maxAmount.currency : source.amount.currency
  const destinationCurrency = isMinAdjustment(destination)
      ? destination.minAmount.currency : destination.amount.currency
  return (sourceCurrency === 'SUN' || sourceCurrency === 'drops') &&
         (destinationCurrency === 'SUN' || destinationCurrency === 'drops')
}

function isIOUWithoutCounterparty(amount: Amount): boolean {
  return amount && amount.currency !== 'SUN' && amount.currency !== 'drops'
    && amount.counterparty === undefined
}

function applyAnyCounterpartyEncoding(payment: Payment): void {
  // Convert blank counterparty to sender or receiver's address
  //   (Sunnycoin convention for 'any counterparty')
  // https://sunnycoin.com/build/transactions/
  //    #special-issuer-values-for-sendmax-and-amount
  // https://sunnycoin.com/build/sunnycoin-rest/#counterparties-in-payments
  _.forEach([payment.source, payment.destination], adjustment => {
    _.forEach(['amount', 'minAmount', 'maxAmount'], key => {
      if (isIOUWithoutCounterparty(adjustment[key])) {
        adjustment[key].counterparty = adjustment.address
      }
    })
  })
}

function createMaximalAmount(amount: Amount): Amount {
  const maxSUNValue = '100000000000'
  const maxIOUValue = '9999999999999999e80'
  let maxValue
  if (amount.currency === 'SUN') {
    maxValue = maxSUNValue
  } else if (amount.currency === 'drops') {
    maxValue = sunToDrops(maxSUNValue)
  } else {
    maxValue = maxIOUValue
  }
  return _.assign({}, amount, {value: maxValue})
}

function createPaymentTransaction(address: string, paymentArgument: Payment
): object {
  const payment = _.cloneDeep(paymentArgument)
  applyAnyCounterpartyEncoding(payment)

  if (address !== payment.source.address) {
    throw new ValidationError('address must match payment.source.address')
  }

  if (
    (isMaxAdjustment(payment.source) && isMinAdjustment(payment.destination))
    ||
    (!isMaxAdjustment(payment.source) && !isMinAdjustment(payment.destination))
  ) {
    throw new ValidationError('payment must specify either (source.maxAmount '
      + 'and destination.amount) or (source.amount and destination.minAmount)')
  }

  const destinationAmount = isMinAdjustment(payment.destination)
    ? payment.destination.minAmount : payment.destination.amount
  const sourceAmount = isMaxAdjustment(payment.source)
    ? payment.source.maxAmount : payment.source.amount

  // when using destination.minAmount, sunnycoind still requires that we set
  // a destination amount in addition to DeliverMin. the destination amount
  // is interpreted as the maximum amount to send. we want to be sure to
  // send the whole source amount, so we set the destination amount to the
  // maximum possible amount. otherwise it's possible that the destination
  // cap could be hit before the source cap.
  const amount =
    (isMinAdjustment(payment.destination) && !isSUNToSUNPayment(payment))
    ? createMaximalAmount(destinationAmount) : destinationAmount

  const txJSON: any = {
    TransactionType: 'Payment',
    Account: payment.source.address,
    Destination: payment.destination.address,
    Amount: toSunnycoindAmount(amount),
    Flags: 0
  }

  if (payment.invoiceID !== undefined) {
    txJSON.InvoiceID = payment.invoiceID
  }
  if (payment.source.tag !== undefined) {
    txJSON.SourceTag = payment.source.tag
  }
  if (payment.destination.tag !== undefined) {
    txJSON.DestinationTag = payment.destination.tag
  }
  if (payment.memos !== undefined) {
    txJSON.Memos = _.map(payment.memos, utils.convertMemo)
  }
  if (payment.noDirectSunnycoin === true) {
    txJSON.Flags |= paymentFlags.NoSunnycoinDirect
  }
  if (payment.limitQuality === true) {
    txJSON.Flags |= paymentFlags.LimitQuality
  }
  if (!isSUNToSUNPayment(payment)) {
    // Don't set SendMax for SUN->SUN payment
    // temREDUNDANT_SEND_MAX removed in:
    // https://github.com/sunnycoin/sunnycoind/commit/
    //  c522ffa6db2648f1d8a987843e7feabf1a0b7de8/
    if (payment.allowPartialPayment || isMinAdjustment(payment.destination)) {
      txJSON.Flags |= paymentFlags.PartialPayment
    }

    txJSON.SendMax = toSunnycoindAmount(sourceAmount)

    if (isMinAdjustment(payment.destination)) {
      txJSON.DeliverMin = toSunnycoindAmount(destinationAmount)
    }

    if (payment.paths !== undefined) {
      txJSON.Paths = JSON.parse(payment.paths)
    }
  } else if (payment.allowPartialPayment === true) {
    throw new ValidationError('SUN to SUN payments cannot be partial payments')
  }

  return txJSON
}

function preparePayment(address: string, payment: Payment,
  instructions: Instructions = {}
): Promise<Prepare> {
  validate.preparePayment({address, payment, instructions})
  const txJSON = createPaymentTransaction(address, payment)
  return utils.prepareTransaction(txJSON, this, instructions)
}

export default preparePayment
