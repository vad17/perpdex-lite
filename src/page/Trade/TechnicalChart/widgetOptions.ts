import { ResolutionString } from "../../../../public/charting_library/datafeed-api"

export const widgetOptions = {
    debug: true,
    symbol: "Perpdex:BTC/USD", // FIX
    datafeed: undefined, // Datafeed
    interval: "60" as ResolutionString, // FIX
    container: "tv_chart_container",
    library_path: "/charting_library/",
    locale: "en",
    disabled_features: ["use_localstorage_for_settings"],
    enabled_features: ["study_templates"],
    charts_storage_url: "https://saveload.tradingview.com",
    charts_storage_api_version: "1.1",
    client_id: "tradingview.com",
    user_id: "public_user_id",
    fullscreen: false,
    autosize: true,
    studies_overrides: {},
    overrides: {
        // "mainSeriesProperties.showCountdown": true,
        "paneProperties.background": "#131722",
        "paneProperties.vertGridProperties.color": "#363c4e",
        "paneProperties.horzGridProperties.color": "#363c4e",
        "symbolWatermarkProperties.transparency": 90,
        "scalesProperties.textColor": "#AAA",
        "mainSeriesProperties.candleStyle.wickUpColor": "#336854",
        "mainSeriesProperties.candleStyle.wickDownColor": "#7f323f",
    },
}
