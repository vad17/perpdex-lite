import { gql } from "@apollo/client"

export const getDepositedsQuery = (schemaType: "thegraph" | "subquery") => {
    return {
        thegraph: gql`
            query {
                depositeds(first: 100) {
                    id
                    exchange
                    trader
                    amount

                    blockNumberLogIndex
                    timestamp
                }
            }
        `,
        subquery: undefined,
    }[schemaType]
}

export const getWithdrawnsQuery = (schemaType: "thegraph" | "subquery") => {
    return {
        thegraph: gql`
            query {
                withdrawns(first: 100) {
                    id
                    exchange
                    trader
                    amount

                    blockNumberLogIndex
                    timestamp
                }
            }
        `,
        subquery: undefined,
    }[schemaType]
}

export const getLiquidityAddedExchangesQuery = (schemaType: "thegraph" | "subquery") => {
    return {
        thegraph: gql`
            query($markets: [String!]) {
                liquidityAddedExchanges(
                    first: 100
                    where: { market_in: $markets }
                    orderBy: timestamp
                    orderDirection: desc
                ) {
                    id
                    exchange
                    trader
                    market
                    base
                    quote
                    liquidity
                    cumBasePerLiquidityX96
                    cumQuotePerLiquidityX96

                    blockNumberLogIndex
                    timestamp
                }
            }
        `,
        subquery: undefined,
    }[schemaType]
}

export const getLiquidityRemovedExchangesQuery = (schemaType: "thegraph" | "subquery") => {
    return {
        thegraph: gql`
            query($markets: [String!]) {
                liquidityRemovedExchanges(
                    first: 100
                    where: { market_in: $markets }
                    orderBy: timestamp
                    orderDirection: desc
                ) {
                    id
                    exchange
                    trader
                    market
                    base
                    quote
                    liquidity
                    liquidator
                    takerBase
                    takerQuote
                    realizedPnl

                    blockNumberLogIndex
                    timestamp
                }
            }
        `,
        subquery: undefined,
    }[schemaType]
}

// export const getPositionChangedsQuery = (schemaType: "thegraph" | "subquery") => {

export const getOrdersQuery = (schemaType: "thegraph" | "subquery") => {
    return {
        thegraph: gql`
            query($markets: [String!]) {
                orders(first: 100, where: { market_in: $markets }, orderBy: timestamp, orderDirection: desc) {
                    id
                    trader
                    market
                    way
                    orderId
                    priceX96
                    volume
                    limitOrderType

                    timestamp
                }
            }
        `,
        subquery: undefined,
    }[schemaType]
}

export const getLimitOrderCreatedExchangesQuery = (schemaType: "thegraph" | "subquery") => {
    return {
        thegraph: gql`
            query($markets: [String!]) {
                limitOrderCreatedExchanges(
                    first: 100
                    where: { market_in: $markets }
                    orderBy: timestamp
                    orderDirection: desc
                ) {
                    id
                    exchange
                    trader
                    market
                    isBid

                    base
                    priceX96
                    limitOrderType
                    orderId
                    baseTaker

                    blockNumberLogIndex
                    timestamp
                }
            }
        `,
        subquery: undefined,
    }[schemaType]
}

export const getLimitOrderSettledsQuery = (schemaType: "thegraph" | "subquery") => {
    return {
        thegraph: gql`
            query($markets: [String!]) {
                limitOrderSettleds(
                    first: 100
                    where: { market_in: $markets }
                    orderBy: timestamp
                    orderDirection: desc
                ) {
                    id
                    exchange
                    trader
                    market

                    base
                    quote
                    realizedPnl

                    blockNumberLogIndex
                    timestamp
                }
            }
        `,
        subquery: undefined,
    }[schemaType]
}
