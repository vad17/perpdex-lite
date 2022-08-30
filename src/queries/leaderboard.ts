import { gql } from "@apollo/client"

export const getProfitRatiosQuery = (schemaType: "thegraph" | "subquery") => {
    return {
        thegraph: gql`
            query($startedAt_gt: [Int!]) {
                profitRatios(first: 100) {
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
