import React, { useCallback, useEffect, useMemo, useState } from "react"
import Big from "big.js"

import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import PositionInput from "./PositionInput"
import { BIG_ZERO } from "constant"
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import { Transaction } from "container/connection/transaction"
import { Box, chakra, Tab, TabList, TabPanel, TabPanels, Tabs, VStack } from "@chakra-ui/react"
import SideSwitcher from "component/base/SideSwitcher"
import Button from "component/base/Button"
import Summary from "./Summary"
import Slippage from "./Slippage"
import { bigNum2Big } from "util/format"
import _ from "lodash"
import PriceInput from "./PriceInput"

interface PreviewResult {
    error: string
    oppositeAmount: Big
}

function TradeInput() {
    const { currentMarketState } = PerpdexMarketContainer.useContainer()
    const { trade, preview, currentMyAccountInfo, createLimitOrder } = PerpdexExchangeContainer.useContainer()
    const [isBuyDisplay, setIsBuyDisplay] = useState<boolean>(true)
    const [isMarket, setIsMarket] = useState<boolean>(true)
    const [limitPrice, setLimitPrice] = useState<Big>(BIG_ZERO)
    const { isLoading } = Transaction.useContainer()
    const [baseOrderValue, setBaseOrderValue] = useState<Big>(BIG_ZERO)
    const [slippage, setSlippage] = useState<number>(2)
    const [previewResult, setPreviewResult] = useState<PreviewResult>({
        error: "",
        oppositeAmount: Big(0),
    })

    const isBuy = useMemo(() => {
        return currentMarketState?.inverse ? !isBuyDisplay : isBuyDisplay
    }, [isBuyDisplay, currentMarketState?.inverse])

    // TODO: apply correct values
    const maxCollateral = useMemo(
        () =>
            currentMyAccountInfo && currentMyAccountInfo.collateralBalance
                ? currentMyAccountInfo.collateralBalance.mul(10)
                : BIG_ZERO,
        [currentMyAccountInfo],
    )

    const handleBasePositionInput = useCallback((value: Big | null) => {
        if (value !== null) {
            setBaseOrderValue(value)
        }
    }, [])

    const handlePriceInput = useCallback(
        (value: Big | null) => {
            if (value !== null) {
                try {
                    setLimitPrice(currentMarketState.inverse ? Big(1).div(value) : value)
                } catch (err) {
                    console.log(err)
                }
            }
        },
        [setLimitPrice, currentMarketState.inverse],
    )

    useEffect(() => {
        if (currentMarketState.baseSymbol) {
            setBaseOrderValue(BIG_ZERO)
        }
    }, [currentMarketState.baseSymbol])

    const isSubmitDisabled = useMemo(() => {
        return baseOrderValue.eq(0) || isLoading || !!previewResult.error
    }, [baseOrderValue, isLoading, previewResult?.error])

    const updatePreview = useCallback(async () => {
        console.log("updatePreview")
        if (isMarket) {
            const results = await preview.trade(isBuy, baseOrderValue, slippage)
            console.log(results)
            if (!results) return
            if (_.isString(results)) {
                setPreviewResult({
                    error: results,
                    oppositeAmount: Big(0),
                })
            } else {
                setPreviewResult({
                    error: "",
                    oppositeAmount: bigNum2Big(results),
                })
            }
        } else {
            const results = await preview.createLimitOrder(isBuy, baseOrderValue, limitPrice)
            console.log(results)
            if (!results) return
            if (_.isString(results)) {
                setPreviewResult({
                    error: results,
                    oppositeAmount: Big(0),
                })
            } else {
                setPreviewResult({
                    error: "",
                    oppositeAmount: Big(0),
                })
            }
        }
    }, [isMarket, preview, isBuy, baseOrderValue, slippage, limitPrice])

    useEffect(() => {
        updatePreview()
    }, [updatePreview])

    const handleTradeSubmit = useCallback(async () => {
        if (baseOrderValue) {
            await trade(isBuy, baseOrderValue, slippage)
        }
    }, [baseOrderValue, trade, isBuy, slippage])

    const handleLimitOrderSubmit = useCallback(async () => {
        if (baseOrderValue) {
            await createLimitOrder(isBuy, baseOrderValue, limitPrice)
        }
    }, [baseOrderValue, isBuy, createLimitOrder, limitPrice])

    const StyledTab = chakra(Tab, {
        baseStyle: {
            color: "gray.200",
            _selected: { color: "white" },
        },
    })

    return (
        <>
            <Box background="#181B41" borderRadius="10px" p={6}>
                <SideSwitcher
                    isBuy={isBuyDisplay}
                    longText="Buy/Long"
                    shortText="Sell/Short"
                    doSwitchToBuy={setIsBuyDisplay}
                />
                <Tabs variant="unstyled" isLazy>
                    <TabList my={2}>
                        <StyledTab pl="0px">Market</StyledTab>
                        <StyledTab>Limit</StyledTab>
                    </TabList>

                    <TabPanels>
                        <TabPanel p={0}>
                            <VStack spacing={6}>
                                <PositionInput
                                    baseSymbol={currentMarketState.baseSymbol}
                                    quoteSymbol={currentMarketState.quoteSymbol}
                                    baseOrderValue={baseOrderValue}
                                    markPrice={currentMarketState.markPrice}
                                    maxCollateral={maxCollateral}
                                    handleBasePositionInput={handleBasePositionInput}
                                />
                                <Slippage slippage={slippage} setSlippage={setSlippage} />
                                <Summary
                                    isMarket={isMarket}
                                    error={previewResult.error}
                                    baseAmount={baseOrderValue}
                                    quoteAmount={previewResult.oppositeAmount}
                                />
                                <Button
                                    text="Confirm Transaction"
                                    onClick={handleTradeSubmit}
                                    isLoading={isLoading}
                                    isDisabled={isSubmitDisabled}
                                    customType="base-dark"
                                    alignSelf="center"
                                />
                            </VStack>
                        </TabPanel>
                        <TabPanel p={0}>
                            <VStack spacing={6}>
                                <PositionInput
                                    baseSymbol={currentMarketState.baseSymbol}
                                    quoteSymbol={currentMarketState.quoteSymbol}
                                    baseOrderValue={baseOrderValue}
                                    markPrice={limitPrice}
                                    maxCollateral={maxCollateral}
                                    handleBasePositionInput={handleBasePositionInput}
                                />
                                <PriceInput
                                    priceUnit={currentMarketState.priceUnitDisplay}
                                    handlePriceInput={handlePriceInput}
                                ></PriceInput>
                                <Summary
                                    isMarket={isMarket}
                                    error={previewResult.error}
                                    baseAmount={baseOrderValue}
                                    quoteAmount={previewResult.oppositeAmount}
                                />
                                <Button
                                    text="Confirm Transaction"
                                    onClick={handleLimitOrderSubmit}
                                    isLoading={isLoading}
                                    isDisabled={isSubmitDisabled}
                                    customType="base-dark"
                                    alignSelf="center"
                                />
                            </VStack>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </>
    )
}

export default TradeInput
