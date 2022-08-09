import React, { useEffect, useMemo, useState } from "react"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { createGetBars } from "util/chart"
import { Connection } from "container/connection"
import { networkConfigs } from "constant/network"
import { isTechnicalChart } from "constant/config"

function TechnicalChart() {
    const { currentMarketState, marketStates } = PerpdexMarketContainer.useContainer()
    const [perpdexTradingViewModule, setPerpdexTradingViewModule] = useState<any>(undefined)

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

    const inputMarketState = useMemo(() => {
        if (isMarketReady) {
            return {
                address: currentMarketState.address,
                exchangeAddress: currentMarketState.exchangeAddress,
                baseSymbol: currentMarketState.baseSymbol,
                quoteSymbol: currentMarketState.quoteSymbol,
                priceUnitDisplay: currentMarketState.priceUnitDisplay,
                name: currentMarketState.name,
                priceFeedQuote: currentMarketState.priceFeedQuote,
                priceFeedBase: currentMarketState.priceFeedBase,
            }
        }
    }, [
        currentMarketState.address,
        currentMarketState.baseSymbol,
        currentMarketState.exchangeAddress,
        currentMarketState.name,
        currentMarketState.priceFeedBase,
        currentMarketState.priceFeedQuote,
        currentMarketState.priceUnitDisplay,
        currentMarketState.quoteSymbol,
        isMarketReady,
    ])

    useEffect(() => {
        ;(async () => {
            if (isTechnicalChart) {
                const moduleName = "perpdex-tradingview"
                const module = await import(moduleName)
                setPerpdexTradingViewModule(module)
            }
        })()
    }, [])

    if (perpdexTradingViewModule && inputMarketState && getBars) {
        const PerpdexTradingView = perpdexTradingViewModule.default
        return <PerpdexTradingView marketState={inputMarketState} getBars={getBars} />
    }

    return <div className="tv_chart_loading">Loading...</div>
}

export default TechnicalChart
