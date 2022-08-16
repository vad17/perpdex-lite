import React, { useMemo } from "react"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { createGetBars } from "util/chart"
import { Connection } from "container/connection"
import { networkConfigs } from "constant/network"
import TradingViewComponent from "./TradingViewComponent"

function TechnicalChart() {
    const { currentMarketState, marketStates } = PerpdexMarketContainer.useContainer()

    const { chainId } = Connection.useContainer()
    const apolloClient = useMemo(
        () =>
            new ApolloClient({
                uri: networkConfigs[chainId || 81].thegraphEndpoint,
                cache: new InMemoryCache(),
            }),
        [chainId],
    )

    const isMarketReady = useMemo(
        () => chainId && apolloClient && currentMarketState && marketStates && Object.keys(marketStates).length > 0,
        [apolloClient, chainId, currentMarketState, marketStates],
    )

    const getBars = useMemo(
        () =>
            isMarketReady
                ? createGetBars(apolloClient, currentMarketState.address, currentMarketState.inverse)
                : undefined,
        [isMarketReady, apolloClient, currentMarketState.address, currentMarketState.inverse],
    )

    if (isMarketReady && getBars) {
        return <TradingViewComponent marketState={currentMarketState} getBars={getBars} />
    }

    return <div className="tv_chart_loading">Loading...</div>
}

export default TechnicalChart
