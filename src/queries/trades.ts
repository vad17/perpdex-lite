import { gql } from "@apollo/client"

export const getCandlesQuery = (schemaType: "thegraph" | "subquery") => {
    return {
        thegraph: gql`
            query($markets: [String!], $timeFormats: [Int!]) {
                candles(
                    first: 100
                    where: { market_in: $markets, timeFormat_in: $timeFormats }
                    orderBy: timestamp
                    orderDirection: desc
                ) {
                    id
                    market
                    timeFormat
                    timestamp
                    openX96
                    highX96
                    lowX96
                    closeX96
                    baseAmount
                    quoteAmount
                }
            }
        `,
        subquery: gql`
            query($markets: [String!], $timeFormats: [Int!]) {
                candles(
                    first: 100
                    filter: { market: { in: $markets }, timeFormat: { in: $timeFormats } }
                    orderBy: [TIMESTAMP_DESC]
                ) {
                    nodes {
                        id
                        market
                        timeFormat
                        timestamp
                        openX96
                        highX96
                        lowX96
                        closeX96
                        baseAmount
                        quoteAmount
                    }
                }
            }
        `,
    }[schemaType]
}

export const candles = `
  query {
    candles(first: 100) {
      nodes {
        id
        market
        timeFormat
        time
        openX96
        highX96
        lowX96
        closeX96
        baseAmount
        quoteAmount
        timestamp
      }
    }
  }
`

export const daySummaries = `
  query {
    daySummaries(first: 100) {
      nodes {
        id
        trader
        dayID
        time
        realizedPnl
        timestamp
      }
    }
  }
`

export const getPositionChangedsQuery = (schemaType: "thegraph" | "subquery") => {
    return {
        thegraph: gql`
            query($markets: [String!]) {
                positionChangeds(first: 100, where: { market_in: $markets }) {
                    id
                    exchange
                    trader
                    market
                    base
                    quote
                    realizedPnl
                    protocolFee
                    baseBalancePerShareX96
                    sharePriceAfterX96
                    liquidator
                    liquidationPenalty
                    liquidationReward
                    insuranceFundReward
                    blockNumberLogIndex
                    timestamp
                }
            }
        `,
        subquery: gql`
            query($markets: [String!]) {
                positionChangeds(first: 100, filter: { market: { in: $markets } }) {
                    nodes {
                        id
                        exchange
                        trader
                        market
                        base
                        quote
                        realizedPnl
                        protocolFee
                        baseBalancePerShareX96
                        sharePriceAfterX96
                        liquidator
                        liquidationPenalty
                        liquidationReward
                        insuranceFundReward
                        blockNumberLogIndex
                        timestamp
                    }
                }
            }
        `,
    }[schemaType]
}

export const getPositionChangedsByTraderQuery = (schemaType: "thegraph" | "subquery") => {
    return {
        thegraph: gql`
            query($markets: [String!], $traders: [String!]) {
                positionChangeds(first: 100, where: { market_in: $markets, trader_in: $traders }) {
                    id
                    exchange
                    trader
                    market
                    base
                    quote
                    realizedPnl
                    protocolFee
                    baseBalancePerShareX96
                    sharePriceAfterX96
                    liquidator
                    liquidationPenalty
                    liquidationReward
                    insuranceFundReward
                    blockNumberLogIndex
                    timestamp
                }
            }
        `,
        subquery: gql`
            query($markets: [String!], $traders: [String!]) {
                positionChangeds(first: 100, filter: { market: { in: $markets }, trader: { in: $traders } }) {
                    nodes {
                        id
                        exchange
                        trader
                        market
                        base
                        quote
                        realizedPnl
                        protocolFee
                        baseBalancePerShareX96
                        sharePriceAfterX96
                        liquidator
                        liquidationPenalty
                        liquidationReward
                        insuranceFundReward
                        blockNumberLogIndex
                        timestamp
                    }
                }
            }
        `,
    }[schemaType]
}

export const positionChangeds = `
  query {
    positionChangeds(first: 100) {
      nodes {
        id
        exchange
        trader
        market
        base
        quote
        realizedPnl
        protocolFee
        baseBalancePerShareX96
        sharePriceAfterX96
        liquidator
        liquidationPenalty
        liquidationReward
        insuranceFundReward
        blockNumberLogIndex
        timestamp
      }
    }
  }
`

export const fundingPaids = `
  query {
    fundingPaids(first: 100) {
      nodes {
        id
        market
        fundingRateX96
        elapsedSec
        premiumX96
        markPriceX96
        cumBasePerLiquidityX96
        cumQuotePerLiquidityX96
        blockNumberLogIndex
        timestamp
      }
    }
  }
`

export const swappeds = `
  query {
    swappeds(first: 100) {
      nodes {
        id
        market
        isBaseToQuote
        isExactInput
        amount
        oppositeAmount
        blockNumberLogIndex
        timestamp
      }
    }
  }
`

export const positionHistories = `
  query {
    positionHistories(first: 100) {
      nodes {
        id

        trader
        market
        histories {
          edges {
            node {
              id
              trader
              market
              time
              base
              quote
              realizedPnl
              protocolFee
              timestamp
            }
          }
        }
        timestamp
      }
    }
  }
`

export const openOrders = `
  query {
    openOrders(first: 100) {
      nodes {
        id

        maker
        market
        base
        quote
        liquidity
        realizedPnl
        timestamp
      }
    }
  }
`
