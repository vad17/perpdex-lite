import { gql } from "@apollo/client"

export const getProfitRatiosQuery = (schemaType: "thegraph" | "subquery") => {
    return {
        thegraph: gql`
            query($startedAtGt: [Int!]) {
                profitRatios(first: 100, where: { startedAt_gt: $startedAtGt }) {
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
