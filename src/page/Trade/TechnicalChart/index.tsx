import React, { useMemo } from "react"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { createGetBars } from "util/chart"
// import { getDatafeed } from "./datafeed"
// import { ChartingLibraryWidgetOptions, IChartingLibraryWidget } from "./charting_library"
// import { ResolutionString } from "./datafeed-api"
import { Connection } from "container/connection"
import { networkConfigs } from "constant/network"
import PerpdexTradingView from "perpdex-tradingview"

function TechnicalChart() {
    const { currentMarketState, marketStates } = PerpdexMarketContainer.useContainer()
    // const [widget, setWidget] = useState<IChartingLibraryWidget | undefined>(undefined)

    const { chainId } = Connection.useContainer()
    const graphUri = networkConfigs[chainId || 81].thegraphEndpoint

    const isMarketReady = useMemo(
        () => graphUri && graphUri !== "" && currentMarketState && marketStates && Object.keys(marketStates).length > 0,
        [currentMarketState, graphUri, marketStates],
    )

    const getBars = useMemo(() => (isMarketReady ? createGetBars(graphUri, currentMarketState) : undefined), [
        graphUri,
        isMarketReady,
        currentMarketState,
    ])

    // useEffect(() => {
    //     if (widget) return

    //     if (graphUri && marketStates && Object.keys(marketStates).length > 0) {
    //         const getBars = createGetBars(graphUri, marketStates)

    //         const _widget = new window.TradingView.widget({
    //             ...widgetOptions,
    //             container: document.getElementById(widgetOptions.container),
    //             datafeed: getDatafeed(getBars),
    //         } as ChartingLibraryWidgetOptions)

    //         _widget.onChartReady(() => {
    //             console.log("Chart has loaded!")
    //             setWidget(_widget)
    //         })
    //     }
    // }, [graphUri, marketStates, widget])

    // useEffect(() => {
    //     if (widget) {
    //         console.log("@@@@@@@ widget", widget)
    //         widget.activeChart().setSymbol(currentMarketState.baseSymbol) // check symbol types
    //     }
    // }, [currentMarketState.baseSymbol, widget])

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

    if (currentMarketState && inputMarketState && getBars) {
        return <PerpdexTradingView marketState={inputMarketState} getBars={getBars} />
    }

    return <div className="TVChartContainer">Loading...</div>
}

export default TechnicalChart
