import React from "react"
import { Thead, Table, Tr, Th, Tbody, Td, chakra, Box } from "@chakra-ui/react"
import { formattedNumberWithCommas } from "util/format"
import Big from "big.js"
import _ from "lodash"
import { MarketState } from "../../../constant/types"

export interface OrderBookItem {
    base: Big
    quote: Big
    priceDisplay: Big
}

interface Props {
    marketState: MarketState
    applyStripe?: boolean
    applyPXZero?: boolean
    height: number
}

function OrderBookTable({
    marketState: { baseSymbol, quoteSymbol, markPriceDisplay, priceUnitDisplay, asks, bids },
    applyStripe = false,
    applyPXZero = false,
    height,
}: Props) {
    const StyledTh = chakra(Th, {
        baseStyle: {
            color: "white",
            borderBottom: "0px none",
            // textTransform: "none",
        },
    })

    const StyledTd = chakra(Td, {
        baseStyle: {
            borderBottom: "0px none",
        },
    })

    const toTr = (isBid: boolean, item: OrderBookItem, idx: number) => {
        return (
            <Tr key={idx} bg={applyStripe && idx % 2 === 0 ? "rgba(98, 126, 234, 0.2)" : ""}>
                <StyledTd color={isBid ? "green.300" : "red.300"} px={applyPXZero ? 0 : "24px"} py={1}>
                    {formattedNumberWithCommas(item.priceDisplay)}
                </StyledTd>
                <StyledTd py={1}>{formattedNumberWithCommas(item.quote)}</StyledTd>
                <StyledTd py={1}>{formattedNumberWithCommas(item.base)}</StyledTd>
            </Tr>
        )
    }

    return (
        <Box overflowY="auto" maxHeight={height}>
            <Table variant="simple" overflowY="scroll">
                <Thead>
                    <Tr>
                        <StyledTh px={applyPXZero ? 0 : "24px"} w="35%">
                            Price({priceUnitDisplay})
                        </StyledTh>
                        <StyledTh w="35%">Size({quoteSymbol})</StyledTh>
                        <StyledTh w="30%">Size({baseSymbol})</StyledTh>
                    </Tr>
                </Thead>
                <Tbody>
                    {asks.length > 0 && _.take(asks, 10).map(_.partial(toTr, false)).reverse()}
                    <Tr key="mid" bg={applyStripe && 1 % 2 === 0 ? "rgba(98, 126, 234, 0.2)" : ""}>
                        <StyledTd
                            // color={isBid ? "green.300" : "red.300"}
                            px={applyPXZero ? 0 : "24px"}
                        >
                            {formattedNumberWithCommas(markPriceDisplay)}
                        </StyledTd>
                        <StyledTd></StyledTd>
                        <StyledTd></StyledTd>
                    </Tr>
                    {bids.length > 0 && _.take(bids, 10).map(_.partial(toTr, true))}
                </Tbody>
            </Table>
        </Box>
    )
}

export default OrderBookTable
