import React, { useEffect, useMemo } from "react"
import { Box } from "@chakra-ui/react"
import OrderHistoryTable from "../../../component/tables/OrderHistoryTable"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { getPositionChangedsQuery } from "queries/trades"
import { cleanUpOrderHistories } from "util/chart"
import _ from "lodash"
import { useThegraphQuery } from "../../../hook/useThegraphQuery"
import { Connection } from "../../../container/connection"

interface Props {
    height: number
}

function OrderHistory({ height }: Props) {
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

    useEffect(() => {
        const iid = setInterval(() => {
            positionChangedsResult.refetch({ markets: [currentMarket, currentMarket.toLowerCase()] })
        }, 5000)

        return () => clearInterval(iid)
    }, [currentMarket])

    return (
        <Box
            w="100%"
            pt={0}
            pb={1}
            pl={8}
            pr={6}
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
                baseSymbol={currentMarketState.baseSymbol}
                priceUnitDisplay={currentMarketState.priceUnitDisplay}
                data={orderHistories}
                applyStripe={true}
                applyPXZero={true}
                height={height}
            />
        </Box>
    )
}

export default OrderHistory
