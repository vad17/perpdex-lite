import { Table, Tbody, Tr, Td, Text, chakra, Box } from "@chakra-ui/react"
import { MarketState } from "../../../constant/types"
import Big from "big.js"
import Button from "component/base/Button"
import { OrderTableItem } from "../PositionTab/OrderTable"

export interface Props {
    marketState: MarketState
    items: OrderTableItem[]
}

function OrderTable({ marketState, items }: Props) {
    const StyledTd = chakra(Td, {
        baseStyle: {
            borderBottom: 0,
        },
    })

    return (
        <>
            {items.map(item => {
                let priceDisplay = item.price
                if (marketState.inverse) {
                    try {
                        priceDisplay = Big(1).div(item.price)
                    } catch {}
                }
                const value = item.quantity.mul(item.price)
                return (
                    <Box w="100%" border="solid rgba(98, 126, 234, 0.6) 1px" borderRadius="10px" p={6} mb={4}>
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
                                        Side
                                    </StyledTd>
                                    <StyledTd textAlign="end">
                                        <Text color={item.isBid ? "green.300" : "red.300"}>
                                            {item.isBid ? "Buy" : "Sell"}
                                        </Text>
                                    </StyledTd>
                                </Tr>
                                <Tr>
                                    <StyledTd pl={0} color="gray.200">
                                        Qty ({marketState.baseSymbol})
                                    </StyledTd>
                                    <StyledTd textAlign="end">{item.quantity.toFixed(7)}</StyledTd>
                                </Tr>
                                <Tr>
                                    <StyledTd pl={0} color="gray.200">
                                        Value ({marketState.quoteSymbol})
                                    </StyledTd>
                                    <StyledTd textAlign="end">{value.toFixed(7)}</StyledTd>
                                </Tr>
                                <Tr>
                                    <StyledTd pl={0} color="gray.200">
                                        Price ({marketState.priceUnitDisplay})
                                    </StyledTd>
                                    <StyledTd textAlign="end">{priceDisplay.toFixed(7)}</StyledTd>
                                </Tr>
                                <Tr>
                                    <StyledTd pl={0} color="gray.200"></StyledTd>
                                    <StyledTd textAlign="end">
                                        <Button
                                            customType="base-dark"
                                            text="Cancel Order"
                                            onClick={item.handleOnClick}
                                        />
                                    </StyledTd>
                                </Tr>
                            </Tbody>
                        </Table>
                    </Box>
                )
            })}
        </>
    )
}

export default OrderTable
