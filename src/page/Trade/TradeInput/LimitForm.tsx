import React, { useCallback, useEffect, useMemo, useState } from "react"
import Big from "big.js"

import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import PositionInput from "./PositionInput"
import { BIG_ZERO } from "constant"
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import { Transaction } from "container/connection/transaction"
import { VStack } from "@chakra-ui/react"
import Button from "component/base/Button"
import Summary from "./Summary"
import _ from "lodash"
import PriceInput from "./PriceInput"
import { LimitOrderType } from "../../../constant/types"

interface PreviewResult {
    error: string
    oppositeAmount: Big
}

interface LimitFormProps {
    isBuyDisplay: boolean
}

function LimitForm({ isBuyDisplay }: LimitFormProps) {
    const { currentMarketState } = PerpdexMarketContainer.useContainer()
    const { preview, currentMyAccountInfo, createLimitOrder } = PerpdexExchangeContainer.useContainer()
    const [limitPrice, setLimitPrice] = useState<Big>(BIG_ZERO)
    const { isLoading } = Transaction.useContainer()
    const [baseOrderValue, setBaseOrderValue] = useState<Big>(BIG_ZERO)
    const [previewResult, setPreviewResult] = useState<PreviewResult>({
        error: "",
        oppositeAmount: Big(0),
    })
    const [limitOrderType, setLimitOrderType] = useState<LimitOrderType>("Normal")

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
    }, [preview, isBuy, baseOrderValue, limitPrice, limitOrderType])

    useEffect(() => {
        updatePreview()
    }, [updatePreview])

    const handleSubmit = useCallback(async () => {
        if (baseOrderValue) {
            await createLimitOrder(isBuy, baseOrderValue, limitPrice, limitOrderType)
        }
    }, [baseOrderValue, createLimitOrder, isBuy, limitPrice, limitOrderType])

    return (
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
                isMarket={false}
                error={previewResult.error}
                baseAmount={baseOrderValue}
                quoteAmount={previewResult.oppositeAmount}
            />
            <Button
                w="100%"
                text="Confirm Transaction"
                onClick={handleSubmit}
                isLoading={isLoading}
                isDisabled={isSubmitDisabled}
                customType="base-blue"
                alignSelf="center"
            />
        </VStack>
    )
}

export default LimitForm
