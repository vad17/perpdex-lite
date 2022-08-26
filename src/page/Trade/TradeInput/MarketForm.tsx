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
import Slippage from "./Slippage"
import { bigNum2Big } from "util/format"
import _ from "lodash"

interface PreviewResult {
    error: string
    oppositeAmount: Big
}

interface MarketFormProps {
    isBuyDisplay: boolean
}

function MarketForm({ isBuyDisplay }: MarketFormProps) {
    const { currentMarketState } = PerpdexMarketContainer.useContainer()
    const { trade, preview, currentMyAccountInfo } = PerpdexExchangeContainer.useContainer()
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
    }, [preview, isBuy, baseOrderValue, slippage])

    useEffect(() => {
        updatePreview()
    }, [updatePreview])

    const handleSubmit = useCallback(async () => {
        if (baseOrderValue) {
            await trade(isBuy, baseOrderValue, slippage)
        }
    }, [baseOrderValue, trade, isBuy, slippage])

    return (
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
                isMarket={true}
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

export default MarketForm
