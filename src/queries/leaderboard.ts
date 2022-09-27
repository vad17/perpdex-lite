import { gql } from "@apollo/client"

export const getProfitRatiosQuery = (schemaType: "thegraph" | "subquery") => {
    return {
        thegraph: gql`
            query {
                profitRatios(first: 1000) {
                    id
                    trader
                    startedAt
                    finishedAt

                    profitRatio
                    profit
                    deposit
                }
            }
        `,
        subquery: undefined,
    }[schemaType]
}
