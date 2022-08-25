import { useEffect, useState, useMemo } from "react"
import { createContainer } from "unstated-next"
import { Connection } from "container/connection"
import { bigNum2Big, bigToX96, x96ToBig } from "util/format"
import { contractConfigs } from "constant/contract"
import { networkConfigs } from "constant/network"
import _ from "lodash"
import { BigNumber, constants } from "ethers"
import { MarketState } from "constant/types"
import Big from "big.js"
import { usePageVisibility } from "react-page-visibility"
import {
    createMarketContractMulticall,
    createExchangeContractMulticall,
    createERC20ContractMulticall,
    createPriceFeedContractMulticall,
} from "../contractFactory"
import { useInterval } from "../../../hook/useInterval"
import produce from "immer"
import { getCandlesQuery } from "../../../queries/trades"
import { useThegraphQuery } from "../../../hook/useThegraphQuery"

const nullMarketState: MarketState = {
    address: constants.AddressZero,
    exchangeAddress: constants.AddressZero,
    baseSymbol: "",
    quoteSymbol: "",
    name: "",
    priceUnitDisplay: "",
    poolInfo: {
        base: Big(0),
        quote: Big(0),
        totalLiquidity: Big(0),
    },
    markPrice: Big(0),
    markPriceDisplay: Big(0),
    baseBalancePerShare: Big(0),
    cumBasePerLiquidity: Big(0),
    cumQuotePerLiquidity: Big(0),
    priceFeedQuote: "",
    priceFeedBase: "",
    indexPriceQuote: Big(0),
    indexPriceBase: Big(0),
    inverse: false,
    poolFeeRatio: Big(0),
    // thegraph
    volume24h: Big(0),
    fee24h: Big(0),
    asks: [],
    bids: [],
}

export const PerpdexMarketContainer = createContainer(usePerpdexMarketContainer)

function usePerpdexMarketContainer() {
    const { signer, chainId, multicallNetworkProvider } = Connection.useContainer()
    const isVisible = usePageVisibility()

    // core
    const [marketStates, setMarketStates] = useState<{ [key: string]: MarketState }>({})

    // utils (this can be separated into other container)
    const [currentMarket, setCurrentMarket] = useState<string>("")
    const currentMarketState: MarketState = useMemo(() => {
        return marketStates[currentMarket] || nullMarketState
    }, [marketStates, currentMarket])

    const candleResult = useThegraphQuery(chainId, getCandlesQuery, {
        variables: {
            markets: _.flatten([_.keys(marketStates), _.map(_.keys(marketStates), key => key.toLowerCase())]),
            timeFormats: [24 * 60 * 60],
        },
    })

    useEffect(() => {
        ;(async () => {
            if (!chainId) return
            if (!multicallNetworkProvider) return

            try {
                const marketAddresses = _.flatten(
                    _.map(contractConfigs[chainId].exchanges, exchange => {
                        return _.map(exchange.markets, "address")
                    }),
                )

                console.log("marketAddresses", marketAddresses)

                const multicallRequest = _.flatten(
                    _.map(marketAddresses, address => {
                        const contract = createMarketContractMulticall(address)
                        return [
                            contract.exchange(),
                            contract.poolInfo(),
                            contract.symbol(),
                            contract.getMarkPriceX96(),
                            contract.baseBalancePerShareX96(),
                            contract.getCumDeleveragedPerLiquidityX96(),
                            contract.priceFeedBase(),
                            contract.priceFeedQuote(),
                            contract.feeRatio(),
                        ]
                    }),
                )

                const multicallResult = await multicallNetworkProvider.all(multicallRequest)

                const multicallRequest2 = _.map(_.range(marketAddresses.length), idx => {
                    const exchangeAddress = multicallResult[9 * idx]
                    const exchangeContract = createExchangeContractMulticall(exchangeAddress)
                    return exchangeContract.settlementToken()
                })
                const settlementTokens = await multicallNetworkProvider.all(multicallRequest2)

                const multicallRequest3 = _.map(settlementTokens, settlementTokenAddress => {
                    if (settlementTokenAddress === constants.AddressZero) {
                        return multicallNetworkProvider.getEthBalance(constants.AddressZero) // dummy
                    }
                    const settlementToken = createERC20ContractMulticall(settlementTokenAddress)
                    return settlementToken.symbol()
                })
                const quoteSymbols = await multicallNetworkProvider.all(multicallRequest3)

                const newMarketStates: { [key: string]: MarketState } = {}

                for (let i = 0; i < marketAddresses.length; i++) {
                    const [
                        exchangeAddress,
                        poolInfo,
                        baseSymbol,
                        markPriceX96,
                        baseBalancePerShareX96,
                        cumDeleveragedPerLiquidityX96,
                        priceFeedBase,
                        priceFeedQuote,
                        poolFeeRatio,
                    ] = multicallResult.slice(9 * i, 9 * (i + 1))

                    const address = marketAddresses[i]
                    const inverse = baseSymbol === "USD"
                    const markPrice = x96ToBig(markPriceX96)
                    const markPriceDisplay = x96ToBig(markPriceX96, inverse)

                    const quoteSymbol =
                        settlementTokens[i] === constants.AddressZero
                            ? networkConfigs[chainId].nativeTokenSymbol
                            : quoteSymbols[i]

                    newMarketStates[address] = {
                        address,
                        exchangeAddress,
                        baseSymbol,
                        quoteSymbol,
                        name: inverse ? `${quoteSymbol}/${baseSymbol} (inverse)` : `${baseSymbol}/${quoteSymbol}`,
                        priceUnitDisplay: inverse ? `${quoteSymbol}/${baseSymbol}` : `${baseSymbol}/${quoteSymbol}`,
                        poolInfo: {
                            base: bigNum2Big(poolInfo.base),
                            quote: bigNum2Big(poolInfo.quote),
                            totalLiquidity: bigNum2Big(poolInfo.totalLiquidity),
                        },
                        markPrice: markPrice,
                        markPriceDisplay: markPriceDisplay,
                        baseBalancePerShare: x96ToBig(baseBalancePerShareX96),
                        cumBasePerLiquidity: x96ToBig(cumDeleveragedPerLiquidityX96[0]),
                        cumQuotePerLiquidity: x96ToBig(cumDeleveragedPerLiquidityX96[1]),
                        priceFeedQuote: priceFeedQuote,
                        priceFeedBase: priceFeedBase,
                        indexPriceQuote: Big(0),
                        indexPriceBase: Big(0),
                        inverse: inverse,
                        volume24h: Big(0),
                        fee24h: Big(0),
                        poolFeeRatio: bigNum2Big(poolFeeRatio, 6),
                        asks: [],
                        bids: [],
                    }
                }
                setMarketStates(newMarketStates)
                setCurrentMarket(marketAddresses[0])
            } catch (err) {
                console.log(err)
            }
        })()
    }, [chainId, signer, multicallNetworkProvider])

    useInterval(async () => {
        if (!isVisible) return
        if (!multicallNetworkProvider) return

        console.log("perpdexMarketContainer polling")

        const marketAddresses = _.keys(marketStates)
        const orderBookCount = 20
        const priceStepPrec = 3
        const getPriceStep = (price: Big) => {
            return Big(10).pow(price.e - priceStepPrec)
        }

        try {
            const askPrices: { [key: string]: any[] } = {}
            const bidPrices: { [key: string]: any[] } = {}
            const multicallRequest = _.flattenDeep(
                _.map(marketAddresses, address => {
                    const contract = createMarketContractMulticall(address)
                    const priceFeedQuote =
                        marketStates[address].priceFeedQuote === constants.AddressZero
                            ? void 0
                            : createPriceFeedContractMulticall(marketStates[address].priceFeedQuote)
                    const priceFeedBase =
                        marketStates[address].priceFeedBase === constants.AddressZero
                            ? void 0
                            : createPriceFeedContractMulticall(marketStates[address].priceFeedBase)

                    const inverse = marketStates[address].inverse
                    const baseBalancePerShare = marketStates[address].baseBalancePerShare
                    const markPriceDisplay = marketStates[address].markPriceDisplay
                    const priceStep = getPriceStep(markPriceDisplay)

                    if (markPriceDisplay.eq(0)) {
                        askPrices[address] = []
                        bidPrices[address] = []
                    } else {
                        const centerPrice = markPriceDisplay.prec(priceStepPrec + 1, Big.roundHalfUp)
                        askPrices[address] = _.map(_.range(orderBookCount), i => {
                            return centerPrice.add(priceStep.mul(1 + i))
                        })
                        bidPrices[address] = _.map(_.range(orderBookCount), i => {
                            return centerPrice.sub(priceStep.mul(1 + i))
                        })
                    }

                    return _.flatten([
                        contract.poolInfo(),
                        contract.getMarkPriceX96(),
                        contract.baseBalancePerShareX96(),
                        contract.getCumDeleveragedPerLiquidityX96(),
                        priceFeedQuote
                            ? priceFeedQuote.decimals()
                            : multicallNetworkProvider.getEthBalance(constants.AddressZero), // dummy
                        priceFeedQuote
                            ? priceFeedQuote.getPrice()
                            : multicallNetworkProvider.getEthBalance(constants.AddressZero), // dummy
                        priceFeedBase
                            ? priceFeedBase.decimals()
                            : multicallNetworkProvider.getEthBalance(constants.AddressZero), // dummy
                        priceFeedBase
                            ? priceFeedBase.getPrice()
                            : multicallNetworkProvider.getEthBalance(constants.AddressZero), // dummy
                        _.map(askPrices[address], priceDisplay => {
                            const price = inverse ? Big(1).div(priceDisplay) : priceDisplay
                            return contract.maxSwapByPrice(inverse, inverse, bigToX96(price.mul(baseBalancePerShare)))
                        }),
                        _.map(bidPrices[address], priceDisplay => {
                            const price = inverse ? Big(1).div(priceDisplay) : priceDisplay
                            return contract.maxSwapByPrice(!inverse, !inverse, bigToX96(price.mul(baseBalancePerShare)))
                        }),
                    ])
                }),
            )
            const multicallResult = await multicallNetworkProvider.all(multicallRequest)

            setMarketStates(
                produce(draft => {
                    let idx = 0
                    for (let i = 0; i < marketAddresses.length; i++) {
                        const marketAddress = marketAddresses[i]
                        const [
                            poolInfo,
                            markPriceX96,
                            baseBalancePerShareX96,
                            cumDeleveragedPerLiquidityX96,
                            priceFeedQuoteDecimals,
                            priceFeedQuotePrice,
                            priceFeedBaseDecimals,
                            priceFeedBasePrice,
                        ] = multicallResult.slice(idx, idx + 8)
                        idx += 8

                        const asks = multicallResult.slice(idx, idx + orderBookCount)
                        idx += orderBookCount
                        const bids = multicallResult.slice(idx, idx + orderBookCount)
                        idx += orderBookCount

                        if (_.has(draft, marketAddress)) {
                            const inverse = draft[marketAddress].inverse

                            const indexPriceQuote =
                                draft[marketAddress].priceFeedQuote === constants.AddressZero
                                    ? Big(1)
                                    : bigNum2Big(priceFeedQuotePrice, priceFeedQuoteDecimals)
                            const indexPriceBase =
                                draft[marketAddress].priceFeedBase === constants.AddressZero
                                    ? Big(1)
                                    : bigNum2Big(priceFeedBasePrice, priceFeedBaseDecimals)

                            const markPriceBig = x96ToBig(markPriceX96, inverse)

                            const indexPriceDisplay = inverse
                                ? indexPriceQuote
                                : indexPriceQuote.eq(0)
                                ? Big(1)
                                : indexPriceBase.div(indexPriceQuote)
                            const markPriceDisplay = markPriceBig.eq(0) ? indexPriceDisplay : markPriceBig // use index price with no pool

                            draft[marketAddress].poolInfo = {
                                base: bigNum2Big(poolInfo.base),
                                quote: bigNum2Big(poolInfo.quote),
                                totalLiquidity: bigNum2Big(poolInfo.totalLiquidity),
                            }
                            draft[marketAddress].markPrice = x96ToBig(markPriceX96)
                            draft[marketAddress].markPriceDisplay = markPriceDisplay
                            draft[marketAddress].baseBalancePerShare = x96ToBig(baseBalancePerShareX96)
                            draft[marketAddress].cumBasePerLiquidity = x96ToBig(cumDeleveragedPerLiquidityX96[0])
                            draft[marketAddress].cumQuotePerLiquidity = x96ToBig(cumDeleveragedPerLiquidityX96[1])
                            draft[marketAddress].indexPriceQuote = indexPriceQuote
                            draft[marketAddress].indexPriceBase = indexPriceBase

                            draft[marketAddress].asks = _.filter(
                                _.map(asks, (ask, i) => {
                                    const price = askPrices[marketAddress][i]
                                    const baseDiff = bigNum2Big(ask.sub(i > 0 ? asks[i - 1] : BigNumber.from(0))).mul(
                                        x96ToBig(baseBalancePerShareX96),
                                    )

                                    return {
                                        base: baseDiff,
                                        quote: inverse ? baseDiff.div(price) : baseDiff.mul(price),
                                        priceDisplay: price,
                                    }
                                }),
                                ask => !ask.base.eq(0),
                            )
                            draft[marketAddress].bids = _.filter(
                                _.map(bids, (bid, i) => {
                                    const price = bidPrices[marketAddress][i]
                                    const baseDiff = bigNum2Big(bid.sub(i > 0 ? bids[i - 1] : BigNumber.from(0))).mul(
                                        x96ToBig(baseBalancePerShareX96),
                                    )

                                    return {
                                        base: baseDiff,
                                        quote: inverse ? baseDiff.div(price) : baseDiff.mul(price),
                                        priceDisplay: price,
                                    }
                                }),
                                bid => !bid.base.eq(0),
                            )

                            // TODO: refactor (It is not good to update irrelevant data at the polling timing of contract)
                            const nodes = candleResult?.data?.candles
                            if (nodes) {
                                // last of complete candle
                                const node = _.filter(
                                    nodes,
                                    node => node.market.toLowerCase() === marketAddress.toLowerCase(),
                                )[1]
                                if (node) {
                                    const volume24h = bigNum2Big(BigNumber.from(node.quoteAmount))
                                    draft[marketAddress].volume24h = volume24h
                                    draft[marketAddress].fee24 = volume24h.mul(draft[marketAddress].poolFeeRatio)
                                }
                            }
                        }
                    }
                }),
            )
        } catch (err) {
            console.log(err)
        }
    }, 5000)

    // do not expose raw interface like contract and BigNumber
    return {
        // core functions
        marketStates,
        // utils
        currentMarket,
        setCurrentMarket,
        currentMarketState,
    }
}
