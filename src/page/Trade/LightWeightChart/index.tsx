import React, { useMemo, useState } from "react"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import Chart from "@qognicafinance/react-lightweight-charts"
import moment from "moment"
import { Connection } from "../../../container/connection"
import { useInterval } from "../../../hook/useInterval"
import { x96ToNumber } from "../../../util/format"
import { usePageVisibility } from "react-page-visibility"
import { createMarketContract } from "../../../container/connection/contractFactory"
import _ from "lodash"

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

interface Bar {
    time: number
    high: number
    low: number
    close: number
    volume: number
}

function LightWeightChart() {
    const { chainId, signer } = Connection.useContainer()
    const { currentMarket, currentMarketState } = PerpdexMarketContainer.useContainer()
    const [bars, setBars] = useState<Bar[]>([])
    const isVisible = usePageVisibility()

    const candlestickSeries = useMemo(() => {
        return [
            {
                data: bars,
            },
        ]
    }, [bars])

    const fetchData = async () => {
        if (!currentMarket) return
        const inverse = currentMarketState.inverse

        const contract = createMarketContract(currentMarket, signer)
        const interval = 5 * 60
        const to = Math.ceil(new Date().getTime() / 1000 / interval) * interval
        const from = to - 200 * interval

        const candles = await contract.getCandles(interval, Math.floor(from), Math.floor((to - from) / interval))
        let bars = _.map(candles, (candle, idx: number) => {
            return {
                time: from + idx * interval,
                low: x96ToNumber(candle.lowX96, inverse),
                high: x96ToNumber(candle.highX96, inverse),
                close: x96ToNumber(candle.closeX96, inverse),
                open: 0,
                volume: candle.quote,
            }
        })
        bars = _.filter(bars, candle => {
            return candle.close !== 0
        })
        _.each(bars, (bar, idx: number) => {
            bar.open = bars[idx === 0 ? 0 : idx - 1].close
        })
        return bars
    }

    useInterval(async () => {
        if (!isVisible) return

        console.log("LightWeightChart polling")

        let newBars: any
        try {
            newBars = await fetchData()
        } catch (err) {
            console.log(err)
        }
        if (!newBars) return

        console.log("polling newBars", newBars)
        setBars(newBars)
    }, 5000)

    return <Chart autoWidth={true} autoHeight={true} options={chartOptions} candlestickSeries={candlestickSeries} />
}

export default LightWeightChart
