import {
    FormControl,
    FormLabel,
    HStack,
    InputRightElement,
    NumberInput,
    NumberInputField,
    Text,
    Tooltip,
} from "@chakra-ui/react"
import { useCallback, useEffect, useMemo, useState } from "react"

import Big from "big.js"
import { BIG_ZERO, USDC_PRECISION } from "constant"
import { formatInput, formattedNumberWithCommas } from "util/format"
import Slider from "component/base/Slider"
import DiscreteLeverageInputModifier from "component/base/DiscreteLeverageInputModifier"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"

interface PositionInputState {
    baseSymbol: string
    quoteSymbol: string
    baseOrderValue: Big
    markPrice: Big
    maxCollateral: Big
    handleBasePositionInput: (value: Big | null) => void
}

function PositionInput({
    baseSymbol,
    quoteSymbol,
    baseOrderValue,
    markPrice,
    maxCollateral,
    handleBasePositionInput,
}: PositionInputState) {
    const { currentMarketState } = PerpdexMarketContainer.useContainer()

    const [baseString, setBaseString] = useState<string>("")
    const [quoteString, setQuoteString] = useState<string>("")
    const [quoteNumber, setQuoteNumber] = useState<Big>(BIG_ZERO)
    const [maxBaseNumber, setMaxBaseNumber] = useState<Big>(BIG_ZERO)
    const [leverage, setLeverage] = useState<number>(1)
    const [showTooltip, setShowTooltip] = useState(false)

    useEffect(() => {
        if (baseOrderValue && baseOrderValue === BIG_ZERO) {
            setBaseString("")
            setQuoteString("")
            setLeverage(1)
        }
    }, [baseOrderValue])

    useEffect(() => {
        if (currentMarketState.markPrice) {
            setMaxBaseNumber(maxCollateral.div(currentMarketState.markPrice))
        }
    }, [currentMarketState.markPrice, maxCollateral])

    const handleOnInput = useCallback(
        (e, isInputBase) => {
            const value = e.target.value
            const regex = /^[0][0-9]$/
            if (regex.test(value)) return
            if (value >= 0) {
                if (Number(value) === 0) {
                    isInputBase ? setBaseString(value) : setQuoteString(value)
                    isInputBase ? setQuoteString("") : setBaseString("")
                    handleBasePositionInput(BIG_ZERO)
                    return
                }

                const formattedValue = formatInput(value, USDC_PRECISION)

                isInputBase ? setBaseString(formattedValue) : setQuoteString(formattedValue)
                try {
                    if (formattedValue && !markPrice.eq(0)) {
                        const inputValue = new Big(formattedValue)
                        const oppositeValue = isInputBase ? inputValue.mul(markPrice) : inputValue.div(markPrice)

                        const isGreaterThanMax = isInputBase
                            ? oppositeValue.gt(maxCollateral)
                            : inputValue.gt(maxCollateral)
                        if (isGreaterThanMax) {
                            setShowTooltip(true)
                        } else {
                            setShowTooltip(false)
                        }

                        isInputBase ? setQuoteNumber(oppositeValue) : setQuoteNumber(inputValue)
                        isInputBase ? setQuoteString(oppositeValue.toFixed(2)) : setBaseString(oppositeValue.toFixed(2))
                        handleBasePositionInput(isInputBase ? inputValue : oppositeValue)
                    }
                } catch (err) {
                    console.error(err)
                }
            }
        },
        [handleBasePositionInput, markPrice, maxCollateral],
    )

    const handleOnChange = useCallback(
        e => {
            if (!(e.target as HTMLInputElement)?.value) {
                setBaseString("")
                setQuoteString("")
            }
        },
        [setBaseString, setQuoteString],
    )

    const handleLeverageUpdate = useCallback(
        (value: number) => {
            if (value !== leverage && !markPrice.eq(0) && !quoteNumber.eq(0)) {
                setLeverage(value)

                const quoteValue = quoteNumber.mul(value).gte(maxCollateral) ? maxCollateral : quoteNumber.mul(value)
                const baseValue = quoteValue.div(markPrice)

                handleBasePositionInput(baseValue)
                setBaseString(baseValue.toFixed(4))
                setQuoteString(quoteValue.toFixed(4))
            }
        },
        [handleBasePositionInput, leverage, markPrice, maxCollateral, quoteNumber],
    )

    const maxLeverage = useMemo(() => {
        if (!quoteNumber.eq(0)) {
            const num = maxCollateral.div(quoteNumber).toNumber()
            if (num <= 1) {
                setLeverage(1)
                return 1
            }

            return num >= 10 ? 10 : Math.round(num * Math.pow(10, 2)) / Math.pow(10, 2)
        }
        return undefined
    }, [maxCollateral, quoteNumber])

    return useMemo(
        () => (
            <FormControl id="margin">
                <FormLabel>
                    <Text fontSize="md" color="white">
                        Collateral
                    </Text>
                </FormLabel>
                <HStack>
                    <Tooltip
                        hasArrow
                        fontSize="sm"
                        bg="#050217"
                        color="white"
                        placement="top"
                        isOpen={showTooltip}
                        label={`Max ${formattedNumberWithCommas(maxBaseNumber, 4)} ${baseSymbol}`}
                    >
                        <NumberInput
                            value={baseString}
                            onInput={e => handleOnInput(e, true)}
                            onBlur={() => setShowTooltip(false)}
                            max={maxBaseNumber.toNumber()}
                        >
                            <NumberInputField onChange={e => handleOnChange(e)} />
                            <InputRightElement w="54px">
                                <Text
                                    w="100%"
                                    textAlign="center"
                                    fontWeight="bold"
                                    fontSize="xs"
                                    color="blue.500"
                                    textTransform="uppercase"
                                >
                                    {baseSymbol}
                                </Text>
                            </InputRightElement>
                        </NumberInput>
                    </Tooltip>
                    <Text fontSize="3xl" ml={2}>
                        /
                    </Text>
                    <Tooltip
                        hasArrow
                        fontSize="sm"
                        bg="#050217"
                        color="white"
                        placement="top"
                        isOpen={showTooltip}
                        label={`Max ${formattedNumberWithCommas(maxCollateral, 4)} ${quoteSymbol}`}
                    >
                        <NumberInput
                            value={quoteString}
                            onInput={e => handleOnInput(e, false)}
                            onBlur={() => setShowTooltip(false)}
                            max={maxCollateral.toNumber()}
                        >
                            <NumberInputField onChange={e => handleOnChange(e)} />
                            <InputRightElement w="54px">
                                <Text
                                    w="100%"
                                    textAlign="center"
                                    fontWeight="bold"
                                    fontSize="xs"
                                    color="blue.500"
                                    textTransform="uppercase"
                                >
                                    {quoteSymbol}
                                </Text>
                            </InputRightElement>
                        </NumberInput>
                    </Tooltip>
                </HStack>
                <Text fontSize="md" color="white" mt="4">
                    Leverage
                </Text>
                <Slider
                    currentValue={leverage}
                    handleUpdate={handleLeverageUpdate}
                    minValue={1}
                    maxValue={maxLeverage}
                />
                <DiscreteLeverageInputModifier handleUpdate={handleLeverageUpdate} maxValue={maxLeverage} />
            </FormControl>
        ),
        [
            showTooltip,
            maxBaseNumber,
            baseSymbol,
            baseString,
            maxCollateral,
            quoteSymbol,
            quoteString,
            leverage,
            handleLeverageUpdate,
            maxLeverage,
            handleOnInput,
            handleOnChange,
        ],
    )
}

export default PositionInput
