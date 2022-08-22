import { chakra, Table, Thead, Tr, Th, Tbody, Td, Text } from "@chakra-ui/react"
import { PerpdexMarketContainer } from "../../../container/connection/perpdexMarketContainer"
import { getPositionChangedsByTraderQuery } from "../../../queries/trades"
import React, { useEffect, useMemo } from "react"
import { cleanUpOrderHistories } from "../../../util/chart"
import { Connection } from "../../../container/connection"
import { OrderHistoryUnit } from "../../../constant/types"
import { formattedNumberWithCommas } from "../../../util/format"
import { formatTime, timezoneStr } from "../../../util/time"
import { useThegraphQuery } from "../../../hook/useThegraphQuery"

function OrderHistoryTable() {
    const { account, chainId } = Connection.useContainer()
    const { currentMarket, currentMarketState } = PerpdexMarketContainer.useContainer()
    const marketName = currentMarketState.name

    const positionChangedsResult = useThegraphQuery(chainId, getPositionChangedsByTraderQuery, {
        variables: {
            markets: [currentMarket, currentMarket.toLowerCase()],
            traders: [account, account?.toLowerCase()],
        },
    })

    useEffect(() => {
        const iid = setInterval(() => {
            positionChangedsResult.refetch({
                markets: [currentMarket, currentMarket.toLowerCase()],
                traders: [account, account?.toLowerCase()],
            })
        }, 5000)

        return () => clearInterval(iid)
    }, [account, currentMarket])

    const data = useMemo(() => {
        if (positionChangedsResult.loading || positionChangedsResult.error) return []
        return cleanUpOrderHistories(positionChangedsResult.data, currentMarketState.inverse)
    }, [
        positionChangedsResult.data,
        positionChangedsResult.loading,
        positionChangedsResult.error,
        currentMarketState.inverse,
    ])

    const StyledTh = chakra(Th, {
        baseStyle: {
            fontSize: "sm",
            textTransform: "none",
        },
    })

    return (
        <Table variant="simple">
            <Thead>
                <Tr>
                    <StyledTh>Date({timezoneStr()})</StyledTh>
                    <StyledTh>Pair</StyledTh>
                    <StyledTh>Side</StyledTh>
                    <StyledTh>Position Size</StyledTh>
                    <StyledTh>Price</StyledTh>
                    <StyledTh>Realized PnL</StyledTh>
                    {/*<StyledTh>Trading Fee</StyledTh>*/}
                </Tr>
            </Thead>
            <Tbody>
                {data &&
                    data.length > 0 &&
                    data.map((value: OrderHistoryUnit, index: number) => {
                        const marketState = currentMarketState
                        return (
                            <Tr key={index}>
                                <Td>{formatTime(value.time, true)}</Td>
                                <Td>{marketName}</Td>
                                <Td>
                                    <Text color={value.isLongDisplay ? "green.300" : "red.300"}>
                                        {value.isLongDisplay ? "Buy" : "Sell"}
                                    </Text>
                                </Td>
                                <Td>
                                    {formattedNumberWithCommas(value.size)} {marketState.baseSymbol}
                                </Td>
                                <Td>
                                    {formattedNumberWithCommas(value.priceDisplay)} {marketState.priceUnitDisplay}
                                </Td>
                                <Td>
                                    {formattedNumberWithCommas(value.realizedPnl)} {marketState.baseSymbol}
                                </Td>
                            </Tr>
                        )
                    })}
            </Tbody>
        </Table>
    )
}

export default OrderHistoryTable
