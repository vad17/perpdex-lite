import React from "react"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { Connection } from "container/connection"
import { TVChartContainer } from "../../../tradingView/TVChartContainer"

function TechnicalChart() {
    const { currentMarketState, marketStates } = PerpdexMarketContainer.useContainer()
    const { chainId } = Connection.useContainer()

    // const datafeed = useMemo(
    //     () => {
    //
    //     },
    //     [currentMarketState.address, currentMarketState.inverse],
    // )

    const datafeed = new (window as any).Datafeeds.UDFCompatibleDatafeed("https://demo_feed.tradingview.com")

    return <TVChartContainer datafeed={datafeed}></TVChartContainer>
}

export default TechnicalChart
