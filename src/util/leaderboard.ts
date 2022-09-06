import { LeaderboardScoreUnit } from "constant/types"
import { bigNum2Big, formattedNumberWithCommas } from "./format"
import _ from "lodash"

export function cleanUpProfitRatios(queryResponse: any) {
    if (!queryResponse || !queryResponse.profitRatios) return

    const profitRatios = queryResponse.profitRatios

    const leaderboardScores: LeaderboardScoreUnit[] = profitRatios.map((values: any) => {
        console.log("each profitRatio", values)

        const profit = bigNum2Big(values.profit) + "ETH"
        const deposit = bigNum2Big(values.deposit) + "ETH"
        const pnlRatioValue = bigNum2Big(values.profit).div(bigNum2Big(values.deposit)).mul(100)

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
