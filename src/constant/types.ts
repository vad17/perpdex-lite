import Big from "big.js"
import { ReactNode } from "react"

export type LimitOrderType = "Normal" | "PostOnly" | "Ioc"

export interface PoolInfo {
    base: Big
    quote: Big
    totalLiquidity: Big
}

export interface PoolSummary {
    tvl: string
    tvlUsd: string
    volume24h: string
    fee24h: string
}

export interface MarketSummary {
    address: string
    quoteSymbolDisplay: string
    baseSymbolDisplay: string
    marketName: string
    markPrice: string
}

export interface OrderBookItem {
    base: Big
    quote: Big
    priceDisplay: Big
}

export interface MarketState {
    address: string
    exchangeAddress: string
    baseSymbol: string
    quoteSymbol: string
    priceUnitDisplay: string
    name: string
    poolInfo: PoolInfo
    markPrice: Big
    markPriceDisplay: Big
    baseBalancePerShare: Big
    cumBasePerLiquidity: Big
    cumQuotePerLiquidity: Big
    priceFeedQuote: string
    priceFeedBase: string
    indexPriceQuote: Big
    indexPriceBase: Big
    inverse: boolean
    poolFeeRatio: Big
    // thegraph
    volume24h: Big
    fee24h: Big
    asks: OrderBookItem[]
    bids: OrderBookItem[]
}

export interface MakerInfo {
    liquidity: Big
    cumBaseSharePerLiquidity: Big
    cumQuotePerLiquidity: Big
}

export interface TakerInfo {
    baseBalanceShare: Big
    quoteBalance: Big
}

export interface LimitOrderInfo {
    base: Big
    price: Big
}

export interface AccountInfo {
    takerInfos: { [key: string]: TakerInfo }
    makerInfos: { [key: string]: MakerInfo }
    askInfos: { [key: string]: { [key: string]: LimitOrderInfo } }
    bidInfos: { [key: string]: { [key: string]: LimitOrderInfo } }
    settlementTokenBalance: Big
    collateralBalance: Big
    totalAccountValue: Big
    leverage: Big
    marginRatio: Big
}

export interface ExchangeState {
    imRatio: Big
    mmRatio: Big
    myAccountInfo: AccountInfo
}

export interface LpCollateralState {
    base: Big
    quote: Big
}

export interface PositionState {
    isLong: boolean
    isLongDisplay: boolean
    positionQuantity: Big
    positionValue: Big
    entryPriceDisplay: Big
    liqPriceDisplay: Big
    unrealizedPnl: Big
    address?: string
    positionSymbol?: string
}

export interface LongTokenState {
    address: string
    symbol: string
    name: string
    assetAddress: string
    assetSymbol: string
    assetDecimals: number
    assetIsWeth: boolean
    totalSupply: Big
    totalAssets: Big
    myShares: Big
    myAssets: Big
    maxDeposit: Big
    maxMint: Big
    maxWithdraw: Big
    maxRedeem: Big
}

export interface OrderHistoryUnit {
    size: Big
    isLong: boolean
    isLongDisplay: boolean
    priceDisplay: Big
    time: number
    realizedPnl: Big
    market: string
}

export interface MakerPositionInfo {
    unrealizedPnl: Big
    liquidityValue: Big
    liquidityValueUsd: Big
    liquidity: Big
    baseAmount: Big
    quoteAmount: Big
    baseDeleveraged: Big
    quoteDeleveraged: Big
}

export interface LeaderboardScoreUnit {
    pnlRank?: number
    trader: string
    traderDom: ReactNode
    pnlRatioValue: Big
    pnlRatioString: string
    profit: string
    deposit: string
}

export interface Deposited {
    time: string
    trader: string
    amount: string
}

export interface Withdrawns {
    time: string
    trader: string
    amount: string
}

export type HistoryColumn = Deposited | Withdrawns

export type HistoryDataType =
    | "Deposited"
    | "Withdrawn"
    | "LiquidityAddedExchanges"
    | "LiquidityRemovedExchanges"
    | "PositionChangeds"
    | "Orders"
    | "LimitOrderCreatedExchanges"
    | "LimitOrderSettleds"

export interface HistoryData {
    title: string
    type: HistoryDataType
}
