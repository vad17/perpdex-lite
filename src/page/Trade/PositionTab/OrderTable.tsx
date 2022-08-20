import { Table, Thead, Tbody, Tr, Th, Td, Text } from "@chakra-ui/react"
import { MarketState } from "../../../constant/types"
import Big from "big.js"
import Button from "component/base/Button"

export interface OrderTableItem {
    isBid: boolean
    quantity: Big
    price: Big
    handleOnClick: () => void
}

export interface Props {
    marketState: MarketState
    items: OrderTableItem[]
}

function OrderTable({ marketState, items }: Props) {
    return (
        <Table variant="simple">
            <Thead>
                <Tr>
                    <Th>Market</Th>
                    <Th>Qty ({marketState.baseSymbol})</Th>
                    <Th>Value ({marketState.quoteSymbol})</Th>
                    <Th>Price ({marketState.priceUnitDisplay})</Th>
                    <Th>Cancel Order</Th>
                </Tr>
            </Thead>
            <Tbody>
                {items.map(item => {
                    let priceDisplay = item.price
                    if (marketState.inverse) {
                        try {
                            priceDisplay = Big(1).div(item.price)
                        } catch {}
                    }
                    const value = item.quantity.mul(item.price)
                    return (
                        <Tr>
                            <Td>{marketState.name}</Td>
                            <Td>
                                <Text color={item.isBid ? "green.300" : "red.300"}>{item.quantity.toFixed(7)}</Text>
                            </Td>
                            <Td>{value.toFixed(7)}</Td>
                            <Td>{priceDisplay.toFixed(7)}</Td>
                            <Td>
                                <Button customType="base-dark" text="Cancel Order" onClick={item.handleOnClick} />
                            </Td>
                        </Tr>
                    )
                })}
            </Tbody>
        </Table>
    )
}

export default OrderTable
