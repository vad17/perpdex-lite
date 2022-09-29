import _ from "lodash"
import { BigNumber, constants } from "ethers"
import { bigNum2Big, formattedNumberWithCommas, x96ToBig } from "./format"
import { formatTime, normalizeToUnixtime } from "./time"

export function cleanUpDepositeds(queryResponse: any) {
    if (!queryResponse || !queryResponse.depositeds) return

    const depositeds = queryResponse.depositeds

    const results = depositeds.map((values: any) => {
        return {
            trader: values.trader,
            amount: formattedNumberWithCommas(bigNum2Big(values.amount)) + "ETH",
            time: formatTime(normalizeToUnixtime(Number(values.timestamp)), true),
            timestamp: values.timestamp,
        }
    })

    return _.sortBy(results, (data: any) => -data.timestamp)
}

export function cleanUpWithdrawn(queryResponse: any) {
    if (!queryResponse || !queryResponse.withdrawns) return

    const withdrawns = queryResponse.withdrawns

    const results = withdrawns.map((values: any) => {
        return {
            trader: values.trader,
            amount: formattedNumberWithCommas(bigNum2Big(values.amount)) + "ETH",
            time: formatTime(normalizeToUnixtime(Number(values.timestamp)), true),
            timestamp: values.timestamp,
        }
    })

    return _.sortBy(results, (data: any) => -data.timestamp)
}

export function cleanUpLiquidityAddedExchanges(queryResponse: any) {
    if (!queryResponse || !queryResponse.liquidityAddedExchanges) return

    const liquidityAddedExchanges = queryResponse.liquidityAddedExchanges

    const results = liquidityAddedExchanges.map((values: any) => {
        return {
            trader: values.trader,
            market: values.market,

            base: formattedNumberWithCommas(bigNum2Big(values.base)),
            quote: formattedNumberWithCommas(bigNum2Big(values.quote)),
            // cumBasePerLiquidityX96: formattedNumberWithCommas(x96ToBig(values.cumBasePerLiquidityX96)),
            // cumQuotePerLiquidityX96: formattedNumberWithCommas(x96ToBig(values.cumQuotePerLiquidityX96)),
            liquidity: formattedNumberWithCommas(bigNum2Big(values.liquidity)) + "ETH",
            time: formatTime(normalizeToUnixtime(Number(values.timestamp)), true),
            timestamp: values.timestamp,
        }
    })

    return _.sortBy(results, (data: any) => -data.timestamp)
}

export function cleanUpLiquidityRemovedExchanges(queryResponse: any) {
    if (!queryResponse || !queryResponse.liquidityRemovedExchanges) return

    const liquidityRemovedExchanges = queryResponse.liquidityRemovedExchanges

    const results = liquidityRemovedExchanges.map((values: any) => {
        return {
            trader: values.trader,
            // market: values.market,
            liquidator: values.liquidator === constants.AddressZero ? "-" : values.liquidator,
            // base: formattedNumberWithCommas(bigNum2Big(values.base)),
            // quote: formattedNumberWithCommas(bigNum2Big(values.quote)),
            liquidity: formattedNumberWithCommas(bigNum2Big(values.liquidity)) + "ETH",
            // takerBase
            // takerQuote,
            realizedPnl: formattedNumberWithCommas(bigNum2Big(values.realizedPnl)) + "ETH",
            time: formatTime(normalizeToUnixtime(Number(values.timestamp)), true),
            timestamp: values.timestamp,
        }
    })

    return _.sortBy(results, (data: any) => -data.timestamp)
}

export function cleanUpPositionChangeds(queryResponse: any) {
    if (!queryResponse || !queryResponse.positionChangeds) return

    const positionChangeds = queryResponse.positionChangeds

    const results = positionChangeds.map((values: any) => {
        return {
            trader: values.trader,
            // market: values.market,
            // base: formattedNumberWithCommas(bigNum2Big(values.base)),
            // quote: formattedNumberWithCommas(bigNum2Big(values.quote)),
            realizedPnl: formattedNumberWithCommas(bigNum2Big(values.realizedPnl)) + "ETH",
            protocolFee: formattedNumberWithCommas(bigNum2Big(values.protocolFee)) + "ETH",
            // baseBalancePerShareX96
            // sharePriceAfterX96
            // liquidator: values.liquidator === constants.AddressZero ? "-" : values.liquidator,
            // liquidationPenalty
            // liquidationReward
            // insuranceFundReward
            time: formatTime(normalizeToUnixtime(Number(values.timestamp)), true),
            timestamp: values.timestamp,
        }
    })

    return _.sortBy(results, (data: any) => -data.timestamp)
}

export function cleanUpOrders(queryResponse: any) {
    if (!queryResponse || !queryResponse.orders) return

    const orders = queryResponse.orders

    const results = orders.map((values: any) => {
        return {
            trader: values.trader,
            // market: values.market,
            way: values.way,
            orderId: values.orderId,
            price: formattedNumberWithCommas(x96ToBig(BigNumber.from(values.priceX96), true)),
            volume: formattedNumberWithCommas(bigNum2Big(values.volume)) + "ETH",
            limitOrderType: values.limitOrderType,
            time: formatTime(normalizeToUnixtime(Number(values.timestamp)), true),
            timestamp: values.timestamp,
        }
    })

    return _.sortBy(results, (data: any) => -data.timestamp)
}

export function cleanUpLimitOrderCreatedExchanges(queryResponse: any) {
    if (!queryResponse || !queryResponse.limitOrderCreatedExchanges) return

    const limitOrderCreatedExchanges = queryResponse.limitOrderCreatedExchanges

    const results = limitOrderCreatedExchanges.map((values: any) => {
        return {
            trader: values.trader,
            // market: values.market,
            bidOrAsk: values.isBid ? "bid" : "ask",
            base: formattedNumberWithCommas(bigNum2Big(values.base)),
            orderId: values.orderId,
            price: formattedNumberWithCommas(x96ToBig(BigNumber.from(values.priceX96), true)),
            // limitOrderType: values.limitOrderType,
            time: formatTime(normalizeToUnixtime(Number(values.timestamp)), true),
            timestamp: values.timestamp,
        }
    })

    return _.sortBy(results, (data: any) => -data.timestamp)
}

export function cleanUpLimitOrderSettleds(queryResponse: any) {
    if (!queryResponse || !queryResponse.limitOrderSettleds) return

    const limitOrderSettleds = queryResponse.limitOrderSettleds

    const results = limitOrderSettleds.map((values: any) => {
        return {
            trader: values.trader,
            // market: values.market,
            base: formattedNumberWithCommas(bigNum2Big(values.base)),
            quote: formattedNumberWithCommas(bigNum2Big(values.quote)),
            realizedPnl: formattedNumberWithCommas(bigNum2Big(values.realizedPnl)) + "ETH",
            time: formatTime(normalizeToUnixtime(Number(values.timestamp)), true),
            timestamp: values.timestamp,
        }
    })

    return _.sortBy(results, (data: any) => -data.timestamp)
}
