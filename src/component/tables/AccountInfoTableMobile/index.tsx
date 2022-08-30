import { Box, ButtonGroup, chakra, HStack, Table, Tbody, Td, Text, Tr } from "@chakra-ui/react"
import { CurrencyIcon } from "../../Icon"
import { AccountInfo, MarketState } from "../../../constant/types"
import { numberWithCommas } from "../../../util/format"
import Button from "../../base/Button"
import Big from "big.js"

interface Props {
    marketState: MarketState
    myAccountInfo: AccountInfo
    accountAvailable: boolean
    openAccountModal: (isDeposit: boolean) => void
}

function AccountInfoTableMobile(props: Props) {
    const { marketState, myAccountInfo, accountAvailable, openAccountModal } = props

    const totalAccountValue = myAccountInfo?.totalAccountValue || Big(0)
    const totalAccountValueUsd = totalAccountValue.mul(marketState.indexPriceQuote)
    const collateralBalance = myAccountInfo?.collateralBalance || Big(0)
    const collateralBalanceUsd = collateralBalance.mul(marketState.indexPriceQuote)

    const StyledTd = chakra(Td, {
        baseStyle: {
            borderBottom: 0,
        },
    })
    return (
        <Box w="100%" border="solid rgba(98, 126, 234, 0.6) 1px" borderRadius="10px" p={6} mb={4}>
            <Table size="sm" borderRadius="12px" overflow="hidden" w="100%" variant="simple">
                <Tbody>
                    <Tr>
                        <StyledTd px={0} color="gray.200">
                            COIN
                        </StyledTd>
                        <StyledTd pr={0}>
                            <HStack justifyContent="end">
                                <CurrencyIcon symbol={marketState.quoteSymbol} boxSize={6} mr={1} />
                                <Text>{marketState.quoteSymbol}</Text>
                            </HStack>
                        </StyledTd>
                    </Tr>
                    <Tr>
                        <StyledTd px={0} color="gray.200">
                            WALLET BALANCE
                        </StyledTd>
                        <StyledTd textAlign="end" pr={0}>
                            {numberWithCommas(myAccountInfo?.settlementTokenBalance)}
                        </StyledTd>
                    </Tr>
                    <Tr>
                        <StyledTd px={0} color="gray.200">
                            TOTAL ACCOUNT VALUE
                        </StyledTd>
                        <StyledTd pr={0}>
                            <HStack justifyContent="end">
                                <Text>{numberWithCommas(totalAccountValue)}</Text>
                                <Text color="gray.400">(${numberWithCommas(totalAccountValueUsd)})</Text>
                            </HStack>
                        </StyledTd>
                    </Tr>
                    <Tr>
                        <StyledTd px={0} color="gray.200">
                            COLLATERAL
                        </StyledTd>
                        <StyledTd pr={0}>
                            <HStack justifyContent="end">
                                <Text>{numberWithCommas(collateralBalance)}</Text>
                                <Text color="gray.400">(${numberWithCommas(collateralBalanceUsd)})</Text>
                            </HStack>
                        </StyledTd>
                    </Tr>
                    <Tr>
                        <StyledTd px={0} color="gray.200"></StyledTd>
                        <StyledTd textAlign="end" pr={0}>
                            <ButtonGroup spacing="4">
                                <Button
                                    size="sm"
                                    customType="base-blue"
                                    text="Deposit"
                                    isDisabled={!accountAvailable}
                                    onClick={() => {
                                        openAccountModal(true)
                                    }}
                                />
                                <Button
                                    size="sm"
                                    customType="base-dark"
                                    text="Withdraw"
                                    isDisabled={!accountAvailable}
                                    onClick={() => {
                                        openAccountModal(false)
                                    }}
                                />
                            </ButtonGroup>
                        </StyledTd>
                    </Tr>
                </Tbody>
            </Table>
        </Box>
    )
}

export default AccountInfoTableMobile
