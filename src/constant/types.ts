import Big from "big.js"

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

export interface TakerPositionsInfo {
    notional: Big
    size: Big
    margin: Big
    unrealizedPnl: Big
    fee: Big
}

export interface AccountInfo {
    takerInfos: { [key: string]: TakerInfo }
    makerInfos: { [key: string]: MakerInfo }
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

export interface ChartBar {
    time: number
    open: number
    high: number
    low: number
    close: number
    volume?: number
}
