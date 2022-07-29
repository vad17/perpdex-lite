import React, { useMemo } from "react"
import { Box } from "@chakra-ui/react"
import OrderHistoryTable from "../../../component/tables/OrderHistoryTable"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { getPositionChangedsQuery } from "queries/trades"
import { cleanUpOrderHistories } from "util/chart"
import _ from "lodash"
import { useThegraphQuery } from "../../../hook/useThegraphQuery"
import { Connection } from "../../../container/connection"

function OrderHistory() {
    const { chainId } = Connection.useContainer()
    const { currentMarket, currentMarketState } = PerpdexMarketContainer.useContainer()

    const positionChangedsResult = useThegraphQuery(chainId, getPositionChangedsQuery, {
        variables: { markets: [currentMarket, currentMarket.toLowerCase()] },
    })

    const orderHistories = useMemo(() => {
        if (positionChangedsResult.loading || positionChangedsResult.error) return []
        return _.take(cleanUpOrderHistories(positionChangedsResult.data, currentMarketState.inverse), 7)
    }, [
        positionChangedsResult.data,
        positionChangedsResult.loading,
        positionChangedsResult.error,
        currentMarketState.inverse,
    ])

    return (
        <Box
            w="100%"
            borderLeft="1px solid rgba(98, 126, 234, 0.6)"
            p={6}
            mx="0"
            marginInlineStart={[0, "0 !important"]}
            sx={{
                "@media screen and (max-width: 61em)": {
                    borderLeft: "0px none",
                    marginTop: "20px",
                },
            }}
        >
            <OrderHistoryTable
                title="Trade History"
                baseSymbol={currentMarketState.baseSymbol}
                priceUnitDisplay={currentMarketState.priceUnitDisplay}
                data={orderHistories}
                applyStripe={true}
                applyPXZero={true}
            />
        </Box>
    )
}

export default OrderHistory
