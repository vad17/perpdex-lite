import { MarketState } from "../constant/types"
import { createMarketContract } from "../container/connection/contractFactory"
import _ from "lodash"
import { bigNum2Big, x96ToNumber } from "../util/format"

interface DataFeedConfig {
    signer: any
    marketState: MarketState
}

const configurationData = {
    exchanges: [
        {
            value: "perpdex",
            name: "PerpDEX",
            desc: "PerpDEX",
        },
    ],
    symbols_types: [
        {
            name: "crypto",
            value: "crypto",
        },
    ],
    supported_resolutions: ["1", "5", "60", "240", "1D"],
}

export const createDataFeed = (config: DataFeedConfig) => {
    const { marketState } = config
    const contract = createMarketContract(config.marketState.address, config.signer)
    const inverse = marketState.inverse
    let subscriptions: any[] = []

    return {
        onReady: (callback: any) => {
            console.log("data feed onReady called")
            callback(configurationData)
        },
        searchSymbols: (userInput: string, exchange: string, symbolType: string, onResultReadyCallback: any) => {
            const result = [
                {
                    symbol: marketState.name,
                    full_name: marketState.name,
                    description: marketState.name,
                    exchange: "perpdex",
                    ticker: marketState.name,
                    type: "crypto",
                },
            ]
            onResultReadyCallback(result)
        },
        resolveSymbol: async (symbolName: string, onSymbolResolvedCallback: any, onResolveErrorCallback: any) => {
            console.log("data feed resolveSymbol called", symbolName)

            const symbolInfo = {
                ticker: symbolName,
                name: symbolName,
                description: symbolName,
                type: "crypto",
                session: "24x7",
                timezone: "Etc/UTC", // TODO: should change?
                exchange: "perpdex",
                minmov: 1,
                pricescale: 100,
                has_intraday: true,
                has_no_volume: false,
                has_weekly_and_monthly: false,
                supported_resolutions: configurationData.supported_resolutions,
                volume_precision: 2,
                data_status: "streaming",
            }

            onSymbolResolvedCallback(symbolInfo)
        },
        getBars: async (
            symbolInfo: any,
            resolution: string,
            periodParams: any,
            onHistoryCallback: any,
            onErrorCallback: any,
        ) => {
            const { from, to, firstDataRequest } = periodParams
            console.log("data feed getBars called", symbolInfo, resolution, from, to)

            const interval =
                {
                    "1D": 24 * 60 * 60,
                }[resolution] || +resolution * 60

            try {
                // TODO: chunk
                let from2 = Math.max(0, Math.floor(from / interval) * interval)
                const to2 = Math.max(0, Math.floor(to / interval) * interval)

                let bars: any[] = []
                while (from2 < to2) {
                    const step = Math.min(200, (to2 - from2) / interval)
                    const candles = await contract.getCandles(interval, from2, step)
                    bars.push(
                        _.map(candles, (candle, idx: number) => {
                            return {
                                time: (from2 + idx * interval) * 1000,
                                low: x96ToNumber(candle.lowX96, inverse),
                                high: x96ToNumber(candle.highX96, inverse),
                                close: x96ToNumber(candle.closeX96, inverse),
                                open: 0,
                                volume: bigNum2Big(candle.quote).toNumber(),
                            }
                        }),
                    )
                    from2 += step * interval
                }
                bars = _.flatten(bars)
                console.log("data feed", bars)

                bars = _.filter(bars, candle => {
                    return candle.close !== 0
                })
                _.each(bars, (bar, idx: number) => {
                    bar.open = bars[idx === 0 ? 0 : idx - 1].close
                })

                console.log(`data feed getBars returned ${bars.length} bars`)
                onHistoryCallback(bars, { noData: _.isEmpty(bars) })
            } catch (error) {
                console.log("data feed getBars error", error)
                onErrorCallback(error)
            }
        },
        subscribeBars(
            symbolInfo: any,
            resolution: any,
            onRealtimeCallback: any,
            subscriberUID: any,
            onResetCacheNeededCallback: any,
        ) {
            console.log("data feed subscribeBars", symbolInfo, resolution, subscriberUID)
            const timerId = setInterval(async () => {
                // TODO:
            }, 60 * 1000)
            subscriptions.push({
                timerId: timerId,
                subscriberUID: subscriberUID,
            })
        },
        unsubscribeBars(subscriberUID: any) {
            console.log("data feed unsubscribeBars", subscriberUID)
            const subscription = _.find(subscriptions, subscription => {
                return subscription.subscriberUID === subscriberUID
            })
            if (!subscription) return

            clearInterval(subscription.timerId)
            subscriptions = _.filter(subscriptions, subscription => {
                return subscription.subscriberUID !== subscriberUID
            })
        },
    }
}
