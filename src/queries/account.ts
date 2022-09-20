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
            query {
                liquidityAddedExchanges(first: 100) {
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
