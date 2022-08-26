import { Table, Thead, Tbody, Tr, Th, Td, Text, chakra, Box } from "@chakra-ui/react"
import { MarketState } from "../../../constant/types"
import Big from "big.js"
import Button from "component/base/Button"

export interface PositionTableState {
    marketState: MarketState
    isLongDisplay: boolean
    positionQuantity: string
    positionValue: string
    entryPriceDisplay: Big
    markPriceDisplay: Big
    liqPriceDisplay: Big
    unrealizedPnl: string
    handleOnClick: () => void
}

function PositionTable({
    isLongDisplay,
    positionQuantity,
    positionValue,
    entryPriceDisplay,
    markPriceDisplay,
    liqPriceDisplay,
    unrealizedPnl,
    handleOnClick,
    marketState,
}: PositionTableState) {
    const StyledTh = chakra(Th, {
        baseStyle: {
            fontSize: "sm",
            textTransform: "none",
        },
    })

    return (
        <Box overflowY="auto" maxHeight="500px">
            <Table variant="simple">
                <Thead position="sticky" top={0} bg="#050217">
                    <Tr>
                        <StyledTh>Pair</StyledTh>
                        <StyledTh>Qty ({marketState.baseSymbol})</StyledTh>
                        <StyledTh>Value ({marketState.quoteSymbol})</StyledTh>
                        <StyledTh>Entry Price ({marketState.priceUnitDisplay})</StyledTh>
                        <StyledTh>Mark Price ({marketState.priceUnitDisplay})</StyledTh>
                        {/*TODO: implement*/}
                        {/*<StyledTh>*/}
                        {/*    Liq. price ({marketState.baseSymbolDisplay}/{marketState.quoteSymbolDisplay})*/}
                        {/*</StyledTh>*/}
                        <StyledTh>Unrealzied PNL ({marketState.quoteSymbol})</StyledTh>
                        <StyledTh></StyledTh>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>{marketState.name}</Td>
                        <Td>
                            <Text color={isLongDisplay ? "green.300" : "red.300"}>{positionQuantity}</Text>
                        </Td>
                        <Td>{positionValue}</Td>
                        <Td>{entryPriceDisplay.toFixed(7)}</Td>
                        <Td>{markPriceDisplay.toFixed(7)}</Td>
                        {/*<Td>{liqPriceDisplay.toFixed(7)}</Td>*/}
                        <Td>{unrealizedPnl}</Td>
                        <Td>
                            <Button customType="base-dark" text="Close Position" onClick={handleOnClick} />
                        </Td>
                    </Tr>
                </Tbody>
            </Table>
        </Box>
    )
}

export default PositionTable
