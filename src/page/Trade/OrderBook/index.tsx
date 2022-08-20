import React from "react"
import { Box } from "@chakra-ui/react"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import OrderBookTable from "../../../component/tables/OrderBookTable"

function OrderBook() {
    const { currentMarketState } = PerpdexMarketContainer.useContainer()

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
            <OrderBookTable marketState={currentMarketState} applyStripe={true} applyPXZero={true} />
        </Box>
    )
}

export default OrderBook
