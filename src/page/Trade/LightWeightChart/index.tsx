import React, { useMemo, useState } from "react"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { getCandlesQuery } from "queries/trades"
import { cleanUpChartInputData } from "util/chart"
import Chart from "@qognicafinance/react-lightweight-charts"
import moment from "moment"
import { Connection } from "../../../container/connection"
import { useThegraphQuery } from "../../../hook/useThegraphQuery"
import { Center, CircularProgress } from "@chakra-ui/react"

const chartOptions = {
    layout: {
        background: { color: "#17181e" },
        textColor: "rgba(255, 255, 255, 1)",
    },
    grid: {
        vertLines: { visible: false, color: "rgba(197, 203, 206, 0.7)" },
        horzLines: { visible: false, color: "rgba(197, 203, 206, 0.7)" },
    },
    timeScale: {
        timeVisible: true,
        secondsVisible: false,
    },
    localization: {
        timeFormatter: (time: number) => {
            return moment.unix(time).format()
        },
    },
}

function LightWeightChart() {
    const { chainId } = Connection.useContainer()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { currentMarket, currentMarketState } = PerpdexMarketContainer.useContainer()

    const candleResult = useThegraphQuery(chainId, getCandlesQuery, {
        variables: {
            markets: [currentMarket, currentMarket.toLowerCase()],
            timeFormats: [60 * 60],
        },
    })

    const candlestickSeries = useMemo(() => {
        if (candleResult.loading || candleResult.error) return [{ data: [] }]
        const candlesData = candleResult.data
        const chartInputData = cleanUpChartInputData(candlesData, currentMarketState.inverse)

        setIsLoading(false)
        return [
            {
                data: chartInputData || [],
            },
        ]
    }, [candleResult.data, candleResult.loading, candleResult.error])

    return isLoading ? (
        <Center h="100%">
            <CircularProgress isIndeterminate size="30px" />
        </Center>
    ) : (
        <Chart autoWidth={true} autoHeight={true} options={chartOptions} candlestickSeries={candlestickSeries} />
    )
}

export default LightWeightChart
