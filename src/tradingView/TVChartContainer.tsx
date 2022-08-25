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

const widget = (window as any)?.TradingView.widget

export interface ChartContainerProps {
    symbol: string
    interval: string

    datafeed: any
    libraryPath: string
    chartsStorageUrl: string
    chartsStorageApiVersion: string
    clientId: string
    userId: string
    fullscreen: boolean
    autosize: boolean
    studiesOverrides: any
    container: any
}

export interface ChartContainerState {}

function getLanguageFromURL(): string | null {
    const regex = new RegExp("[\\?&]lang=([^&#]*)")
    const results = regex.exec(window.location.search)
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "))
}

export class TVChartContainer extends React.PureComponent<Partial<ChartContainerProps>, ChartContainerState> {
    public static defaultProps: Omit<ChartContainerProps, "container"> = {
        symbol: "AAPL",
        interval: "D",
        datafeed: {},
        libraryPath: "/charting_library/",
        chartsStorageUrl: "https://saveload.tradingview.com",
        chartsStorageApiVersion: "1.1",
        clientId: "tradingview.com",
        userId: "public_user_id",
        fullscreen: false,
        autosize: true,
        studiesOverrides: {},
    }

    private tvWidget: any | null = null
    private ref: React.RefObject<HTMLDivElement> = React.createRef()

    public componentDidMount(): void {
        if (!this.ref.current) {
            return
        }

        const widgetOptions = {
            symbol: this.props.symbol as string,
            datafeed: this.props.datafeed,
            interval: this.props.interval,
            container: this.ref.current,
            library_path: this.props.libraryPath as string,

            locale: getLanguageFromURL() || "en",
            disabled_features: ["use_localstorage_for_settings"],
            enabled_features: ["study_templates"],
            charts_storage_url: this.props.chartsStorageUrl,
            charts_storage_api_version: this.props.chartsStorageApiVersion,
            client_id: this.props.clientId,
            user_id: this.props.userId,
            fullscreen: this.props.fullscreen,
            autosize: this.props.autosize,
            studies_overrides: this.props.studiesOverrides,

            theme: "dark",
        }

        const tvWidget = new widget(widgetOptions)
        this.tvWidget = tvWidget

        tvWidget.onChartReady(() => {
            tvWidget.headerReady().then(() => {
                const button = tvWidget.createButton()
                button.setAttribute("title", "Click to show a notification popup")
                button.classList.add("apply-common-tooltip")
                button.addEventListener("click", () =>
                    tvWidget.showNoticeDialog({
                        title: "Notification",
                        body: "TradingView Charting Library API works correctly",
                        callback: () => {
                            console.log("Noticed!")
                        },
                    }),
                )
                button.innerHTML = "Check API"
            })
        })
    }

    public componentWillUnmount(): void {
        if (this.tvWidget !== null) {
            this.tvWidget.remove()
            this.tvWidget = null
        }
    }

    public render(): JSX.Element {
        return <div ref={this.ref} className={"TVChartContainer"} />
    }
}
