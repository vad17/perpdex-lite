import {
    FormControl,
    FormLabel,
    HStack,
    InputRightElement,
    NumberInput,
    NumberInputField,
    Text,
} from "@chakra-ui/react"
import { useCallback, useEffect, useMemo, useState } from "react"

import Big from "big.js"
import { USDC_PRECISION } from "constant"
import { formatInput } from "util/format"

interface PriceInputState {
    priceUnit: string
    markPriceDisplay: Big
    handlePriceInput: (value: Big | null) => void
}

function PriceInput({ priceUnit, markPriceDisplay, handlePriceInput }: PriceInputState) {
    const [priceString, setPriceString] = useState<string>("")

    useEffect(() => {
        setPriceString(markPriceDisplay.toFixed(2))
        handlePriceInput(markPriceDisplay)
    }, [])

    const handleOnInput = useCallback(
        e => {
            const value = e.target.value
            if (value >= 0) {
                const formattedValue = formatInput(value, USDC_PRECISION)

                setPriceString(formattedValue)
                try {
                    if (formattedValue) {
                        const inputValue = new Big(formattedValue)
                        handlePriceInput(inputValue)
                    }
                } catch (err) {
                    console.error(err)
                }
            }
        },
        [handlePriceInput],
    )

    return useMemo(
        () => (
            <FormControl id="margin" w="100%">
                <FormLabel>
                    <Text fontSize="md" color="white">
                        Limit Price
                    </Text>
                </FormLabel>
                <HStack>
                    <NumberInput w="100%" value={priceString} onInput={e => handleOnInput(e)}>
                        <NumberInputField />
                        <InputRightElement w="54px" mr={3}>
                            <Text
                                w="100%"
                                textAlign="center"
                                fontWeight="bold"
                                fontSize="xs"
                                color="blue.500"
                                textTransform="uppercase"
                            >
                                {priceUnit}
                            </Text>
                        </InputRightElement>
                    </NumberInput>
                </HStack>
            </FormControl>
        ),
        [priceString, handleOnInput, priceUnit],
    )
}

export default PriceInput
