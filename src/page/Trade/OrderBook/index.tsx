import React from "react"
import { Box } from "@chakra-ui/react"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import OrderBookTable from "../../../component/tables/OrderBookTable"

interface Props {
    height: number
}

function OrderBook({ height }: Props) {
    const { currentMarketState } = PerpdexMarketContainer.useContainer()

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
            <OrderBookTable marketState={currentMarketState} applyStripe={true} applyPXZero={true} height={height} />
        </Box>
    )
}

export default OrderBook
