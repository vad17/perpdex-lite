// MIT License
//
// Copyright (c) 2018 TradingView, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import * as React from "react"
import "./index.css"
import { useEffect } from "react"

export interface ChartContainerProps {
    widget?: any
    symbol?: string
    interval?: string

    datafeed?: any
    libraryPath?: string
    chartsStorageUrl?: string
    chartsStorageApiVersion?: string
    clientId?: string
    userId?: string
    fullscreen?: boolean
    autosize?: boolean
    studiesOverrides?: any
    container?: any
}

function getLanguageFromURL(): string | null {
    const regex = new RegExp("[\\?&]lang=([^&#]*)")
    const results = regex.exec(window.location.search)
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "))
}

export const TVChartContainer = (props: ChartContainerProps) => {
    const defaultProps: Omit<ChartContainerProps, "container"> = {
        widget: (window as any)?.TradingView?.widget,
        symbol: "AAPL",
        interval: "5",
        datafeed: {},
        libraryPath: "./charting_library/",
        chartsStorageUrl: "https://saveload.tradingview.com",
        chartsStorageApiVersion: "1.1",
        clientId: "tradingview.com",
        userId: "public_user_id",
        fullscreen: false,
        autosize: true,
        studiesOverrides: {},
    }
    props = { ...defaultProps, ...props }

    const ref = React.useRef<HTMLDivElement>(null)

    useEffect(() => {
        const widgetOptions = {
            symbol: props.symbol,
            datafeed: props.datafeed,
            interval: props.interval,
            container: ref.current,
            library_path: props.libraryPath as string,

            // locale: getLanguageFromURL() || "en",
            locale: "en",
            disabled_features: ["use_localstorage_for_settings"],
            enabled_features: ["study_templates"],
            charts_storage_url: props.chartsStorageUrl,
            charts_storage_api_version: props.chartsStorageApiVersion,
            client_id: props.clientId,
            user_id: props.userId,
            fullscreen: props.fullscreen,
            autosize: props.autosize,
            studies_overrides: props.studiesOverrides,

            theme: "dark",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }

        let tvWidget = new props.widget(widgetOptions)

        return () => {
            if (tvWidget) {
                tvWidget.remove()
                tvWidget = null
            }
        }
    }, [props.widget, props.symbol, props.datafeed])

    return <div ref={ref} className={"TVChartContainer"} />
}
