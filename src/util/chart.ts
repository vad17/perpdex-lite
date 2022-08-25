import { OrderHistoryUnit } from "constant/types"
import { BigNumber } from "ethers"
import { bigNum2Big, x96ToBig } from "./format"
import { normalizeToUnixtime } from "./time"
import _ from "lodash"
import Big from "big.js"

export function cleanUpOrderHistories(queryResponse: any, inverse: boolean) {
    if (!queryResponse || !queryResponse.positionChangeds) return

    const positionHistories = queryResponse.positionChangeds

    const histories: OrderHistoryUnit[] = positionHistories.map((history: any) => {
        console.log("each history", history)

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
