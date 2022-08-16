import React from "react"
import { widgetOptions } from "./widgetOptions"
import { ChartingLibraryWidgetOptions } from "../../../../public/charting_library/charting_library"
import { getDatafeed } from "./datafeed"
import "./styles.css"
import { MarketState } from "constant/types"

declare global {
    interface Window {
        TradingView: any
    }
}

let widgetLoaded = false
let widgetAddress = ""

interface TradingViewComponentProps {
    marketState: MarketState
    getBars: any
}

const TradingViewComponent = ({ marketState, getBars }: TradingViewComponentProps) => {
    if (widgetAddress !== marketState.address) {
        widgetLoaded = false
    }

    if (window.TradingView && marketState.priceUnitDisplay !== "") {
        if (!widgetLoaded) {
            const _widget = new window.TradingView.widget({
                ...widgetOptions,
                container: document.getElementById(widgetOptions.container),
                symbol: marketState.priceUnitDisplay,
                datafeed: getDatafeed(getBars),
            } as ChartingLibraryWidgetOptions)

            _widget.onChartReady(() => {
                _widget.activeChart().setSymbol(`Perpdex:${marketState.priceUnitDisplay}`)
            })

            widgetLoaded = true
            widgetAddress = marketState.address
        }
    }

    return <div id={widgetOptions.container} />
}

export default TradingViewComponent
