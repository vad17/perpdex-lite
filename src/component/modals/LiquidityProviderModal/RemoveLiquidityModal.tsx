import { Divider, VStack, Text, NumberInput, InputGroup, NumberInputField, FormControl, HStack } from "@chakra-ui/react"
import Slippage from "./Slippage"
import React, { useCallback, useEffect, useState, useMemo } from "react"
import { Modal as ModalContainer } from "container/modal"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { MinusIcon } from "@chakra-ui/icons"
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import { formatInput, numberWithCommas } from "../../../util/format"
import { Trade } from "../../../container/perpetual/trade"
import Big from "big.js"
import { INPUT_PRECISION } from "../../../constant"
import SmallFormLabel from "../../base/SmallFormLabel"
import Modal from "component/base/Modal"
import Button from "component/base/Button"
import { Transaction } from "container/connection/transaction"

function RemoveLiquidityModal() {
    const {
        removeLiquidityModalIsOpen,
        actions: { toggleRemoveLiquidityModal },
    } = ModalContainer.useContainer()

    const { currentMyMakerInfo, removeLiquidity } = PerpdexExchangeContainer.useContainer()
    const { currentMarketState } = PerpdexMarketContainer.useContainer()
    const { isLoading } = Transaction.useContainer()

    const { slippage } = Trade.useContainer()
    const [liquidity, setLiquidity] = useState<string>("0")

    const isEnabled = useMemo<boolean>(() => {
        if (!currentMyMakerInfo) return false
        let liq
        try {
            liq = Big(liquidity)
        } catch (err) {
            console.log(err)
            return false
        }
        if (liq.gt(currentMyMakerInfo.liquidity)) return false
        if (liq.eq(0)) return false
        return true
    }, [currentMyMakerInfo, liquidity])

    const handleRemoveLiquidity = useCallback(() => {
        const liq = Big(liquidity)
        removeLiquidity(liq, slippage)
    }, [liquidity, currentMarketState?.poolInfo, removeLiquidity, slippage])

    const handleOnInput = useCallback(
        e => {
            const value = e.target.value
            if (value >= 0) {
                const formattedValue = formatInput(value, INPUT_PRECISION)
                setLiquidity(formattedValue)
            }
        },
        [setLiquidity],
    )

    // Reset values when market is updated
    useEffect(() => {
        if (currentMarketState.baseSymbol) {
            setLiquidity("0")
        }
    }, [currentMarketState.baseSymbol])

    const handleMax = useCallback(() => {
        const value = currentMyMakerInfo?.liquidity
        if (value) {
            const formattedValue = value.toFixed(INPUT_PRECISION, Big.roundDown)
            setLiquidity(formattedValue)
        }
    }, [currentMyMakerInfo?.liquidity])

    return (
        <Modal
            headerText="Remove Liquidity"
            isOpen={removeLiquidityModalIsOpen}
            onClose={toggleRemoveLiquidityModal}
            size="md"
            body={
                <VStack spacing={5}>
                    <Text align="center" fontSize="medium" fontWeight="bold" lineHeight="1.4">
                        Mark Price: {numberWithCommas(currentMarketState.markPriceDisplay)}
                        {currentMarketState.priceUnitDisplay}
                    </Text>
                    <FormControl id="margin">
                        <SmallFormLabel>Liquidity</SmallFormLabel>
                        <NumberInput value={liquidity} onInput={handleOnInput}>
                            <InputGroup>
                                <NumberInputField />
                            </InputGroup>
                        </NumberInput>
                    </FormControl>
                    <HStack justifyContent="space-between" w="100%">
                        <Text>Liquidity {numberWithCommas(currentMyMakerInfo?.liquidity)}</Text>
                        <Button size="xs" customType="base-blue" text="MAX" borderRadius="5px" onClick={handleMax} />
                    </HStack>
                    <Divider />
                    <Slippage />
                    <Divider />
                </VStack>
            }
            footer={
                <Button
                    text="Remove Liquidity"
                    customType="base-blue"
                    onClick={handleRemoveLiquidity}
                    leftIcon={<MinusIcon />}
                    isDisabled={!isEnabled}
                    isLoading={isLoading}
                />
            }
        />
    )
}

export default RemoveLiquidityModal
