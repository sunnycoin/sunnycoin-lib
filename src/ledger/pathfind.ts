import * as _ from 'lodash'
import BigNumber from 'bignumber.js'
import {getSUNBalance, renameCounterpartyToIssuer} from './utils'
import {
  validate,
  toSunnycoindAmount,
  errors,
  sunToDrops,
  dropsToSun
} from '../common'
import {Connection} from '../common'
import parsePathfind from './parse/pathfind'
import {SunnycoindAmount, Amount} from '../common/types/objects'
import {
  GetPaths, PathFind, SunnycoindPathsResponse, PathFindRequest
} from './pathfind-types'
const NotFoundError = errors.NotFoundError
const ValidationError = errors.ValidationError


function addParams(request: PathFindRequest, result: SunnycoindPathsResponse
): SunnycoindPathsResponse {
  return _.defaults(_.assign({}, result, {
    source_account: request.source_account,
    source_currencies: request.source_currencies
  }), {destination_amount: request.destination_amount})
}

function requestPathFind(connection: Connection, pathfind: PathFind
): Promise<SunnycoindPathsResponse> {
  const destinationAmount: Amount = _.assign(
    {
      // This is converted back to drops by toSunnycoindAmount()
      value: pathfind.destination.amount.currency === 'SUN' ?
        dropsToSun('-1') : '-1'
    },
    pathfind.destination.amount
  )
  const request: PathFindRequest = {
    command: 'sunnycoin_path_find',
    source_account: pathfind.source.address,
    destination_account: pathfind.destination.address,
    destination_amount: toSunnycoindAmount(destinationAmount)
  }
  if (typeof request.destination_amount === 'object'
      && !request.destination_amount.issuer) {
    // Convert blank issuer to sender's address
    // (Sunnycoin convention for 'any issuer')
    // https://sunnycoin.com/build/transactions/
    //     #special-issuer-values-for-sendmax-and-amount
    // https://sunnycoin.com/build/sunnycoin-rest/#counterparties-in-payments
    request.destination_amount.issuer = request.destination_account
  }
  if (pathfind.source.currencies && pathfind.source.currencies.length > 0) {
    request.source_currencies = pathfind.source.currencies.map(
      amount => renameCounterpartyToIssuer(amount))
  }
  if (pathfind.source.amount) {
    if (pathfind.destination.amount.value !== undefined) {
      throw new ValidationError('Cannot specify both source.amount'
        + ' and destination.amount.value in getPaths')
    }
    request.send_max = toSunnycoindAmount(pathfind.source.amount)
    if (typeof request.send_max !== 'string' && !request.send_max.issuer) {
      request.send_max.issuer = pathfind.source.address
    }
  }

  return connection.request(request).then(paths => addParams(request, paths))
}

function addDirectSunPath(paths: SunnycoindPathsResponse, sunBalance: string
): SunnycoindPathsResponse {
  // Add SUN "path" only if the source acct has enough SUN to make the payment
  const destinationAmount = paths.destination_amount
  // @ts-ignore: destinationAmount can be a currency amount object! Fix!
  if ((new BigNumber(sunBalance)).greaterThanOrEqualTo(destinationAmount)) {
    paths.alternatives.unshift({
      paths_computed: [],
      source_amount: paths.destination_amount
    })
  }
  return paths
}

function isSunnycoindIOUAmount(amount: SunnycoindAmount) {
  // sunnycoind SUN amounts are specified as decimal strings
  return (typeof amount === 'object') &&
    amount.currency && (amount.currency !== 'SUN')
}

function conditionallyAddDirectSUNPath(connection: Connection, address: string,
  paths: SunnycoindPathsResponse
): Promise<SunnycoindPathsResponse> {
  if (isSunnycoindIOUAmount(paths.destination_amount)
      || !_.includes(paths.destination_currencies, 'SUN')) {
    return Promise.resolve(paths)
  }
  return getSUNBalance(connection, address, undefined).then(
    sunBalance => addDirectSunPath(paths, sunBalance))
}

function filterSourceFundsLowPaths(pathfind: PathFind,
  paths: SunnycoindPathsResponse
): SunnycoindPathsResponse {
  if (pathfind.source.amount &&
      pathfind.destination.amount.value === undefined && paths.alternatives) {
    paths.alternatives = _.filter(paths.alternatives, alt => {
      if (!alt.source_amount) {
        return false
      }
      const pathfindSourceAmountValue = new BigNumber(
        pathfind.source.amount.currency === 'SUN' ?
        sunToDrops(pathfind.source.amount.value) :
        pathfind.source.amount.value)
      const altSourceAmountValue = new BigNumber(
        typeof alt.source_amount === 'string' ?
        alt.source_amount :
        alt.source_amount.value
      )
      return altSourceAmountValue.eq(pathfindSourceAmountValue)
    })
  }
  return paths
}

function formatResponse(pathfind: PathFind, paths: SunnycoindPathsResponse) {
  if (paths.alternatives && paths.alternatives.length > 0) {
    return parsePathfind(paths)
  }
  if (paths.destination_currencies !== undefined &&
      !_.includes(paths.destination_currencies,
        pathfind.destination.amount.currency)) {
    throw new NotFoundError('No paths found. ' +
      'The destination_account does not accept ' +
      pathfind.destination.amount.currency + ', they only accept: ' +
      paths.destination_currencies.join(', '))
  } else if (paths.source_currencies && paths.source_currencies.length > 0) {
    throw new NotFoundError('No paths found. Please ensure' +
      ' that the source_account has sufficient funds to execute' +
      ' the payment in one of the specified source_currencies. If it does' +
      ' there may be insufficient liquidity in the network to execute' +
      ' this payment right now')
  } else {
    throw new NotFoundError('No paths found.' +
      ' Please ensure that the source_account has sufficient funds to' +
      ' execute the payment. If it does there may be insufficient liquidity' +
      ' in the network to execute this payment right now')
  }
}

function getPaths(pathfind: PathFind): Promise<GetPaths> {
  validate.getPaths({pathfind})

  const address = pathfind.source.address
  return requestPathFind(this.connection, pathfind).then(paths =>
    conditionallyAddDirectSUNPath(this.connection, address, paths)
  )
    .then(paths => filterSourceFundsLowPaths(pathfind, paths))
    .then(paths => formatResponse(pathfind, paths))
}

export default getPaths
