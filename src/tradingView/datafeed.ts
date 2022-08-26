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

const resolutionToInterval = (resolution: string): number => {
    return (
        {
            "1D": 24 * 60 * 60,
        }[resolution] || +resolution * 60
    )
}

interface RawBar {
    low: number
    high: number
    close: number
    volume: number
}
const barCache: { [address: string]: { [interval: string]: { [time: string]: RawBar } } } = {}

const getBarCache = (address: string, interval: number) => {
    barCache[address] = barCache[address] || {}
    barCache[address][interval] = barCache[address][interval] || {}
    return barCache[address][interval]
}

const addCandlesToCache = (address: string, interval: number, from: number, inverse: boolean, candles: any[]) => {
    console.log("data feed addCandlesToCache", candles)
    _.each(candles, (candle, idx: number) => {
        if (candle.closeX96.eq(0)) return
        getBarCache(address, interval)[from + idx * interval] = {
            low: x96ToNumber(candle.lowX96, inverse),
            high: x96ToNumber(candle.highX96, inverse),
            close: x96ToNumber(candle.closeX96, inverse),
            volume: bigNum2Big(candle.quote).toNumber(),
        }
    })
}

const getCacheBars = (address: string, interval: number, from: number, to: number) => {
    let bars = _.map(getBarCache(address, interval), (bar, time) => {
        return {
            time: +time * 1000,
            open: 0,
            ...bar,
        }
    })
    bars = _.sortBy(bars, "time")
    _.each(bars, (bar, idx: number) => {
        bar.open = bars[idx === 0 ? 0 : idx - 1].close
    })
    return _.filter(bars, bar => {
        return from * 1000 <= bar.time && bar.time < to * 1000
    })
}

const getCacheLastTime = (address: string, interval: number): number => {
    return _.max(_.map(_.keys(getBarCache(address, interval)), _.toNumber)) || 0
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
                has_empty_bars: true,
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

            const interval = resolutionToInterval(resolution)

            try {
                const lastTime = getCacheLastTime(config.marketState.address, interval)
                let from2 = Math.max(lastTime, Math.floor(from / interval) * interval)
                const to2 = Math.floor(to / interval) * interval
                console.log("data feed", lastTime, from2, to2)
                while (from2 < to2) {
                    const step = Math.min(200, (to2 - from2) / interval)
                    const candles = await contract.getCandles(interval, from2, step)
                    addCandlesToCache(config.marketState.address, interval, from2, inverse, candles)
                    from2 += step * interval
                }

                const bars = getCacheBars(config.marketState.address, interval, from, to)
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
            const interval = resolutionToInterval(resolution)
            const timerId = setInterval(async () => {
                const lastTime = getCacheLastTime(config.marketState.address, interval)
                const candles = await contract.getCandles(interval, lastTime, 2)
                addCandlesToCache(config.marketState.address, interval, lastTime, inverse, candles)
                const bars = getCacheBars(config.marketState.address, interval, lastTime, lastTime + 2 * interval)
                console.log("data feed subscription bars", bars)
                _.each(bars, onRealtimeCallback)
            }, 5 * 1000)
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
