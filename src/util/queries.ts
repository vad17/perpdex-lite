import _ from "lodash"
import { bigNum2Big, formattedNumberWithCommas } from "./format"
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
