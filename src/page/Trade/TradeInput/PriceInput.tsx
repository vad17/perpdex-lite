import {
    FormControl,
    FormLabel,
    HStack,
    InputRightElement,
    NumberInput,
    NumberInputField,
    Text,
} from "@chakra-ui/react"
import { useCallback, useMemo, useState } from "react"

import Big from "big.js"
import { USDC_PRECISION } from "constant"
import { formatInput } from "util/format"

interface PriceInputState {
    priceUnit: string
    handlePriceInput: (value: Big | null) => void
}

function PriceInput({ priceUnit, handlePriceInput }: PriceInputState) {
    const [priceString, setPriceString] = useState<string>("")

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
                    <NumberInput value={priceString} onInput={e => handleOnInput(e)}>
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
