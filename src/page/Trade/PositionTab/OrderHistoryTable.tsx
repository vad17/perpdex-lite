import { chakra, Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react"
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
            color: "white",
            borderBottom: "0px none",
            fontWeight: "bold",
            textTransform: "none",
        },
    })

    const StyledTd = chakra(Td, {
        baseStyle: {
            borderBottom: "0px none",
        },
    })

    return (
        <Table variant="simple">
            <Thead>
                <Tr>
                    <StyledTh>Time({timezoneStr()})</StyledTh>
                    <StyledTh>Market</StyledTh>
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
                                <StyledTd>{formatTime(value.time, true)}</StyledTd>
                                <StyledTd>{marketName}</StyledTd>
                                <StyledTd>{value.isLongDisplay ? "Long" : "Short"}</StyledTd>
                                <StyledTd>
                                    {formattedNumberWithCommas(value.size)} {marketState.baseSymbol}
                                </StyledTd>
                                <StyledTd>
                                    {formattedNumberWithCommas(value.priceDisplay)} {marketState.priceUnitDisplay}
                                </StyledTd>
                                <StyledTd>
                                    {formattedNumberWithCommas(value.realizedPnl)} {marketState.baseSymbol}
                                </StyledTd>
                            </Tr>
                        )
                    })}
            </Tbody>
        </Table>
    )
}

export default OrderHistoryTable
