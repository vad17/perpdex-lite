import { LeaderboardScoreUnit } from "constant/types"
import { bigNum2Big, formattedNumberWithCommas } from "./format"
import _ from "lodash"
import { BIG_ZERO } from "../constant"

export function cleanUpProfitRatios(queryResponse: any) {
    if (!queryResponse || !queryResponse.profitRatios) return

    const profitRatios = queryResponse.profitRatios

    const leaderboardScores: LeaderboardScoreUnit[] = profitRatios.map((values: any) => {
        console.log("each profitRatio", values)

        const depositBig = bigNum2Big(values.deposit)

        const profit = bigNum2Big(values.profit) + "ETH"
        const deposit = depositBig + "ETH"
        const pnlRatioValue = depositBig.eq(0) ? BIG_ZERO : bigNum2Big(values.profit).div(depositBig).mul(100)

        return {
            trader: values.trader,
            profit,
            deposit,
            pnlRatioValue,
            pnlRatioString: formattedNumberWithCommas(pnlRatioValue, 10) + "%",
        } as LeaderboardScoreUnit
    })

    return _.sortBy(leaderboardScores, (data: any) => -data.pnlRatioValue).map((item, index) => ({
        pnlRank: index + 1,
        ...item,
    }))
}
