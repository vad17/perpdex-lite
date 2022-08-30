import { LeaderboardScoreUnit } from "constant/types"
import { BigNumber } from "ethers"
import { formattedNumberWithCommas, x96ToBig } from "./format"
import _ from "lodash"

export function cleanUpProfitRatios(queryResponse: any) {
    if (!queryResponse || !queryResponse.profitRatios) return

    const profitRatios = queryResponse.profitRatios

    const leaderboardScores: LeaderboardScoreUnit[] = profitRatios.map((values: any) => {
        console.log("each profitRatio", values)

        const profit = formattedNumberWithCommas(x96ToBig(BigNumber.from(values.profit))) + "ETH"
        const deposit = formattedNumberWithCommas(x96ToBig(BigNumber.from(values.deposit))) + "ETH"
        const pnlRatio = formattedNumberWithCommas(x96ToBig(BigNumber.from(values.profitRatio))) + "%"

        return {
            trader: values.trader,
            profit,
            deposit,
            pnlRatio,
        } as LeaderboardScoreUnit
    })

    return _.sortBy(leaderboardScores, (data: any) => -data.pnlRatio).map((item, index) => ({
        pnlRank: index + 1,
        ...item,
    }))
}
