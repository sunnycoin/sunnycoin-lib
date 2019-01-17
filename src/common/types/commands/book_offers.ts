import {
  TakerRequestAmount,
  SunnycoindAmount,
  OfferLedgerEntry
} from '../objects'

export interface BookOffersRequest {
  taker?: string,
  taker_gets: TakerRequestAmount,
  taker_pays: TakerRequestAmount,
  ledger_hash?: string,
  ledger_index?: number | ('validated' | 'closed' | 'current'),
  limit?: number,
  marker?: any
}

export interface BookOffersResponse {
  offers: BookOffer[],
  ledger_hash?: string,
  ledger_current_index?: number,
  ledger_index?: number,
  marker?: any
}

export interface BookOffer extends OfferLedgerEntry {
  quality?: string
  owner_funds?: string,
  taker_gets_funded?: SunnycoindAmount,
  taker_pays_funded?: SunnycoindAmount
}
