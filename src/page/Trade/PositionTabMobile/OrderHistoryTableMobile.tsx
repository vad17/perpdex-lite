import { chakra, Table, Tr, Tbody, Td, Text, Box } from "@chakra-ui/react"
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

    const StyledTd = chakra(Td, {
        baseStyle: {
            borderBottom: 0,
        },
    })

    return (
        <>
            {data &&
                data.length > 0 &&
                data.map((value: OrderHistoryUnit) => {
                    const marketState = currentMarketState
                    return (
                        <Box w="100%" border="solid rgba(98, 126, 234, 0.6) 1px" borderRadius="10px" p={6} mb={4}>
                            <Table size="sm" borderRadius="12px" overflow="hidden" w="100%" variant="simple">
                                <Tbody>
                                    <Tr>
                                        <StyledTd pl={0} color="gray.200">
                                            Date({timezoneStr()})
                                        </StyledTd>
                                        <StyledTd textAlign="end">{formatTime(value.time, true)}</StyledTd>
                                    </Tr>
                                    <Tr>
                                        <StyledTd pl={0} color="gray.200">
                                            Pair
                                        </StyledTd>
                                        <StyledTd textAlign="end">{marketName}</StyledTd>
                                    </Tr>
                                    <Tr>
                                        <StyledTd pl={0} color="gray.200">
                                            Side
                                        </StyledTd>
                                        <StyledTd textAlign="end">
                                            <Text color={value.isLongDisplay ? "green.300" : "red.300"}>
                                                {value.isLongDisplay ? "Buy" : "Sell"}
                                            </Text>
                                        </StyledTd>
                                    </Tr>
                                    <Tr>
                                        <StyledTd pl={0} color="gray.200">
                                            Position Size
                                        </StyledTd>
                                        <StyledTd textAlign="end">
                                            {formattedNumberWithCommas(value.size)} {marketState.baseSymbol}
                                        </StyledTd>
                                    </Tr>
                                    <Tr>
                                        <StyledTd pl={0} color="gray.200">
                                            Price
                                        </StyledTd>
                                        <StyledTd textAlign="end">
                                            {formattedNumberWithCommas(value.priceDisplay)}{" "}
                                            {marketState.priceUnitDisplay}
                                        </StyledTd>
                                    </Tr>
                                    <Tr>
                                        <StyledTd pl={0} color="gray.200">
                                            Realized PnL
                                        </StyledTd>
                                        <StyledTd textAlign="end">
                                            {formattedNumberWithCommas(value.realizedPnl)} {marketState.baseSymbol}
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

export default OrderHistoryTable
