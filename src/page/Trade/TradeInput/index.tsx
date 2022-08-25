import React, { useCallback, useEffect, useMemo, useState } from "react"
import Big from "big.js"

import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import PositionInput from "./PositionInput"
import { BIG_ZERO } from "constant"
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import { Transaction } from "container/connection/transaction"
import { Box, FormControl, VStack, Wrap, WrapItem } from "@chakra-ui/react"
import SideSwitcher from "component/base/SideSwitcher"
import Button from "component/base/Button"
import Summary from "./Summary"
import Slippage from "./Slippage"
import { bigNum2Big } from "util/format"
import _ from "lodash"
import PriceInput from "./PriceInput"
import { LimitOrderType } from "../../../constant/types"

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
    const [limitOrderType, setLimitOrderType] = useState<LimitOrderType>("Normal")
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
            const results = await preview.createLimitOrder(isBuy, baseOrderValue, limitPrice, limitOrderType)
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
    }, [setPreviewResult, preview?.trade, isMarket, isBuy, baseOrderValue, slippage, limitPrice, limitOrderType])

    useEffect(() => {
        updatePreview()
    }, [updatePreview])

    const handleSubmit = useCallback(async () => {
        if (baseOrderValue) {
            if (isMarket) {
                await trade(isBuy, baseOrderValue, slippage)
            } else {
                await createLimitOrder(isBuy, baseOrderValue, limitPrice, limitOrderType)
            }
        }
    }, [baseOrderValue, limitPrice, limitOrderType, isMarket, isBuy, preview, slippage, trade])

    return (
        <>
            <Box background="#181B41" borderRadius="10px" p={6}>
                <VStack spacing={6}>
                    <FormControl id="margin">
                        <Wrap justify="space-between">
                            <WrapItem w="45%">
                                <Button
                                    customType={isMarket ? "base-green" : "outline-green"}
                                    onClick={() => {
                                        setIsMarket(true)
                                    }}
                                    width="100%"
                                    text="Market"
                                    isFullWidth
                                />
                            </WrapItem>
                            <WrapItem w="45%">
                                <Button
                                    customType={isMarket ? "outline-green" : "base-green"}
                                    onClick={() => {
                                        setIsMarket(false)
                                    }}
                                    width="100%"
                                    text="Limit"
                                    isFullWidth
                                />
                            </WrapItem>
                        </Wrap>
                    </FormControl>
                    <SideSwitcher
                        isBuy={isBuyDisplay}
                        longText="Buy/Long"
                        shortText="Sell/Short"
                        doSwitchToBuy={setIsBuyDisplay}
                    />
                    <PositionInput
                        baseSymbol={currentMarketState.baseSymbol}
                        quoteSymbol={currentMarketState.quoteSymbol}
                        baseOrderValue={baseOrderValue}
                        markPrice={isMarket ? currentMarketState.markPrice : limitPrice}
                        maxCollateral={maxCollateral}
                        handleBasePositionInput={handleBasePositionInput}
                    />

                    {isMarket && <Slippage slippage={slippage} setSlippage={setSlippage} />}
                    {!isMarket && (
                        <PriceInput
                            priceUnit={currentMarketState.priceUnitDisplay}
                            handlePriceInput={handlePriceInput}
                        ></PriceInput>
                    )}
                    <Summary
                        isMarket={isMarket}
                        error={previewResult.error}
                        baseAmount={baseOrderValue}
                        quoteAmount={previewResult.oppositeAmount}
                    />
                </VStack>
            </Box>
            <Button
                text="Confirm Transaction"
                onClick={handleSubmit}
                isLoading={isLoading}
                isDisabled={isSubmitDisabled}
                customType="base-blue"
                alignSelf="center"
            />
        </>
    )
}

export default TradeInput
