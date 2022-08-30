import { Table, Tbody, Tr, Td, Text, Box, chakra } from "@chakra-ui/react"
import Button from "component/base/Button"
import { PositionTableState } from "./../PositionTab/PositionTable"

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
    const StyledTd = chakra(Td, {
        baseStyle: {
            borderBottom: 0,
        },
    })

    return (
        <Box w="100%" border="solid rgba(98, 126, 234, 0.6) 1px" borderRadius="10px" p={6}>
            <Table size="sm" borderRadius="12px" overflow="hidden" w="100%" variant="simple">
                <Tbody>
                    <Tr>
                        <StyledTd pl={0} color="gray.200">
                            Pair
                        </StyledTd>
                        <StyledTd textAlign="end">{marketState.name}</StyledTd>
                    </Tr>

                    <Tr>
                        <StyledTd pl={0} color="gray.200">
                            Qty ({marketState.baseSymbol})
                        </StyledTd>
                        <StyledTd textAlign="end">
                            <Text color={isLongDisplay ? "green.300" : "red.300"}>{positionQuantity}</Text>
                        </StyledTd>
                    </Tr>

                    <Tr>
                        <StyledTd pl={0} color="gray.200">
                            Value ({marketState.quoteSymbol})
                        </StyledTd>
                        <StyledTd textAlign="end">{positionValue}</StyledTd>
                    </Tr>

                    <Tr>
                        <StyledTd pl={0} color="gray.200">
                            Entry Price ({marketState.priceUnitDisplay})
                        </StyledTd>
                        <StyledTd textAlign="end">{entryPriceDisplay.toFixed(7)}</StyledTd>
                    </Tr>

                    <Tr>
                        <StyledTd pl={0} color="gray.200">
                            Mark Price ({marketState.priceUnitDisplay})
                        </StyledTd>
                        <StyledTd textAlign="end">{markPriceDisplay.toFixed(7)}</StyledTd>
                    </Tr>

                    <Tr>
                        <StyledTd pl={0} color="gray.200">
                            Unrealzied PNL ({marketState.quoteSymbol})
                        </StyledTd>
                        <StyledTd textAlign="end">{unrealizedPnl}</StyledTd>
                    </Tr>

                    <Tr>
                        <StyledTd pl={0} color="gray.200"></StyledTd>
                        <StyledTd textAlign="end">
                            <Button customType="base-dark" text="Close Position" onClick={handleOnClick} />
                        </StyledTd>
                    </Tr>
                </Tbody>
            </Table>
        </Box>
    )
}

export default PositionTable
