/* eslint-disable unused-imports/no-unused-vars */
// import { IBasicDataFeed, ResolutionString } from "../../../../public/charting_library"
// import { DatafeedConfiguration, IDatafeedChartApi } from "../../../../public/charting_library/datafeed-api"

const supportedResolutions = ["60", "120", "240", "D", "W"] // "1", "5", "15", "30",

// const config: DatafeedConfiguration = {
//     supported_resolutions: supportedResolutions as ResolutionString[],
//     // currency_codes: ["ASTR", "USD", "BTC", "ETH"]
// }

const config = {
    supported_resolutions: supportedResolutions,
}

// export const getDatafeed = (getBars: IDatafeedChartApi["getBars"]): IBasicDataFeed => {
export const getDatafeed = (getBars: any) => {
    return {
        onReady: (cb: any) => {
            console.log("=====onReady running")
            setTimeout(() => cb(config), 0)
        },

        searchSymbols: (userInput: any, exchange: any, symbolType: any, onResultReadyCallback: any) => {
            console.log("====Search Symbols running")
        },

        resolveSymbol: (symbolName: string, onSymbolResolvedCallback: any, onResolveErrorCallback: any) => {
            // expects a symbolInfo object in response
            console.log("======resolveSymbol running")

            var symbol_stub = {
                name: symbolName,
                ticker: symbolName,
                description: "",
                type: "crypto",
                session: "24x7",
                exchange: "Perpdex",
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                minmov: 1,
                pricescale: 100000000, // or 100?
                has_intraday: true,
                intraday_multipliers: ["1", "60"], // ["60"]
                supported_resolution: supportedResolutions,
                volume_precision: 8,
                // data_status: "streaming",
            }

            setTimeout(function () {
                onSymbolResolvedCallback(symbol_stub)
                console.log("Resolving that symbol....", symbol_stub)
            }, 0)

            // onResolveErrorCallback("Something wrong for resolveSymbol")
        },

        getBars,

        subscribeBars: (
            symbolInfo: any,
            resolution: any,
            onRealtimeCallback: any,
            subscribeUID: any,
            onResetCacheNeededCallback: any,
        ) => {
            console.log("=====subscribeBars runnning")
        },

        unsubscribeBars: (subscriberUID: any) => {
            console.log("=====unsubscribeBars running")
        },

        // calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
        // 	//optional
        // 	console.log('=====calculateHistoryDepth running')
        // 	// while optional, this makes sure we request 24 hours of minute data at a time
        // 	// CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
        // 	return resolution < 60 ? {resolutionBack: 'D', intervalBack: '1'} : undefined
        // },

        // getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
        // 	//optional
        // 	console.log('=====getMarks running')
        // },

        // getTimeScaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
        // 	//optional
        // 	console.log('=====getTimeScaleMarks running')
        // },

        // getServerTime: cb => {
        // 	console.log('=====getServerTime running')
        // }
    }
}
