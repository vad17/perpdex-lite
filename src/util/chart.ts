import { ChartBar, OrderHistoryUnit } from "constant/types"
import { BigNumber } from "ethers"
import { bigNum2Big, x96ToBig } from "./format"
import { normalizeToUnixtime } from "./time"
import _ from "lodash"
import Big from "big.js"
import { getCandlesQuery } from "queries/trades"
import moment from "moment"

export function cleanUpChartInputData(candlesData: any, inverse: boolean) {
    if (!candlesData) return

    const x96ToNumber = (x96: string) => {
        return x96ToBig(BigNumber.from(x96), inverse).toNumber()
    }

    const inputData = _.sortBy(
        candlesData.map((d: any) => ({
            time: normalizeToUnixtime(Number(d.timestamp)),
            open: x96ToNumber(d.openX96),
            high: x96ToNumber(d.highX96),
            low: x96ToNumber(d.lowX96),
            close: x96ToNumber(d.closeX96),
            volume: 0,
        })),
        (data: any) => data.time,
    )

    // Make it easy to understand
    for (let i = 1; i < inputData.length; i++) {
        const prevClose = inputData[i - 1].close
        inputData[i].open = prevClose
        inputData[i].high = Math.max(inputData[i].high, prevClose)
        inputData[i].low = Math.min(inputData[i].low, prevClose)
    }

    if (!inputData || inputData.length === 0) return

    return _.sortBy(inputData, (data: any) => data.time)
}

export function cleanUpOrderHistories(queryResponse: any, inverse: boolean) {
    if (!queryResponse || !queryResponse.positionChangeds) return

    const positionHistories = queryResponse.positionChangeds

    const histories: OrderHistoryUnit[] = positionHistories.map((history: any) => {
        const base = BigNumber.from(history.base)
        // const quote = BigNumber.from(history.quote)

        const isLong = base.gt(0)
        const isLongDisplay = inverse ? !isLong : isLong
        const realizedPnl = bigNum2Big(history.realizedPnl)

        const sharePrice = x96ToBig(BigNumber.from(history.sharePriceAfterX96))
        const baseBalancePerShare = x96ToBig(BigNumber.from(history.baseBalancePerShareX96))
        const price = sharePrice.div(baseBalancePerShare)
        const priceDisplay = inverse ? Big(1).div(price) : price

        const size = bigNum2Big(base.abs()).mul(baseBalancePerShare)
        const time = normalizeToUnixtime(Number(history.timestamp))
        return {
            size,
            isLong,
            isLongDisplay,
            priceDisplay,
            time,
            market: history.market,
            realizedPnl,
        } as OrderHistoryUnit
    })

    return _.sortBy(histories, (data: any) => -data.time)
}

export const createGetBars = (apolloClient: any, marketAddress: string, inverse: boolean) => {
    const getBars = (
        symbolInfo: any,
        resolution: string,
        periodParams: any,
        onHistoryCallback: (bars: ChartBar[], meta: any) => void,
        onErrorCallback: (err: any) => void,
    ) => {
        /**
         * FIX: the number of periodParams.countBack is required to feed bars via onHistoryCallback()
         * getBars will be called until the data feeded
         *
         * https://github.com/tradingview/charting_library/wiki/JS-Api#getbarssymbolinfo-resolution-periodparams-onhistorycallback-onerrorcallback
         * It is recommended to consider the priority of countBack higher than the priority of from, i.e. you must return data in the range [from, to), but the number of bars should not be less than countBack. If the number of bars is less than countBack, the chart will call getBars again.
         */
        console.log("@@@@ calling periodParams!", periodParams)

        return apolloClient
            .query({
                query: getCandlesQuery("subquery"),
                variables: {
                    markets: [marketAddress, marketAddress.toLowerCase()],
                    timeFormats: [60 * 60],
                },
            })
            .then((data: any) => {
                if (data && data.data?.candles?.nodes) {
                    const candles = data.data.candles.nodes
                    console.log("candles", candles)
                    const bars = cleanUpChartInputData(candles, inverse)

                    if (bars && bars.length > 0) {
                        console.log("getBars calling ", bars)
                        // onHistoryCallback(bars, { noData: false })
                    } else {
                        const nextTime = moment().add(1, "minutes").unix()
                        onHistoryCallback([], { noData: true, nextTime })
                    }
                }
            })
            .catch(err => {
                console.log("@@@@ callSubquery errors")
                console.log({ err })
                onErrorCallback(err)
            })
    }
    return getBars
}
