import { Box, Flex, HStack, Text, useMediaQuery, VStack } from "@chakra-ui/react"
import { CurrencyIcon, LogoWhite } from "../Icon"
import Big from "big.js"
import { AccountInfo, MarketState } from "../../constant/types"
import { formattedNumberWithCommas } from "../../util/format"

interface Props {
    marketState: MarketState
    myAccountInfo: AccountInfo
}

function AccountPanel(props: Props) {
    const isMobileAndTabletScreen = useMediaQuery("(max-width: 1024px)")

    const currentMyAccountInfo = props.myAccountInfo
    const currentMarketState = props.marketState

    const quoteSymbol = currentMarketState.quoteSymbol
    const totalAccountValue = currentMyAccountInfo?.totalAccountValue || Big(0)
    const totalAccountValueUsd = totalAccountValue.mul(currentMarketState.indexPriceQuote)
    const collateralBalance = currentMyAccountInfo?.collateralBalance || Big(0)
    const collateralBalanceUsd = collateralBalance.mul(currentMarketState.indexPriceQuote)

    return (
        <Box
            w={{ base: "90%", lg: "80%" }}
            bgGradient="linear(180deg, rgba(98, 126, 234, 0.5) 0%, rgba(249, 0, 119, 0.5) 100%);"
            borderRadius={20}
            p={{ base: 30, lg: 59 }}
            m={{ base: 5, lg: 10 }}
            mt={{ base: 0, lg: 10 }}
        >
            <VStack spacing={{ base: 10, lg: 28 }} alignItems="stretch">
                <HStack w="100%" justifyContent="space-between" alignItems="center">
                    <LogoWhite></LogoWhite>
                    <Box></Box>
                </HStack>
                <VStack spacing={8}>
                    <Flex
                        direction={{ base: "column", lg: "row" }}
                        w="100%"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box mb={{ base: 6, lg: 0 }}>
                            <VStack spacing={0}>
                                <Text fontSize="xs">Total Account Value</Text>
                                <HStack w="100%" justifyContent="start">
                                    <Text as="span" fontSize="xl" fontWeight="bold">
                                        {formattedNumberWithCommas(totalAccountValue)} {quoteSymbol}
                                    </Text>
                                    <Text as="span" fontSize="xl" marginLeft={2}>
                                        (${formattedNumberWithCommas(totalAccountValueUsd)})
                                    </Text>
                                </HStack>
                            </VStack>
                        </Box>
                        <HStack spacing={12}>
                            <Box>
                                <VStack spacing={0}>
                                    <Text fontSize="xs">Collateral</Text>
                                    <HStack w="100%" justifyContent="start">
                                        <Text as="span" fontSize="xl" fontWeight="bold">
                                            {formattedNumberWithCommas(collateralBalance)} {quoteSymbol}
                                        </Text>
                                        <Text as="span" fontSize="xl" marginLeft={2}>
                                            (${formattedNumberWithCommas(collateralBalanceUsd)})
                                        </Text>
                                    </HStack>
                                </VStack>
                            </Box>
                            {!isMobileAndTabletScreen[0] && <Box></Box>}
                        </HStack>
                    </Flex>
                    <HStack w="100%" justifyContent="space-between" alignItems="center">
                        <Box></Box>
                        <CurrencyIcon symbol={currentMarketState.quoteSymbol} boxSize={12}></CurrencyIcon>
                    </HStack>
                </VStack>
            </VStack>
        </Box>
    )
}

export default AccountPanel
