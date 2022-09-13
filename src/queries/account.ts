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
