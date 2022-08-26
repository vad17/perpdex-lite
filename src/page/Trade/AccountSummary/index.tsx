import { Box, Heading } from "@chakra-ui/react"
import AccountInfoTable from "./AccountInfoTable"
import { PerpdexMarketContainer } from "../../../container/connection/perpdexMarketContainer"
import { PerpdexExchangeContainer } from "../../../container/connection/perpdexExchangeContainer"

function Summary() {
    const { currentMarketState } = PerpdexMarketContainer.useContainer()
    const { currentMyAccountInfo, currentExchangeState } = PerpdexExchangeContainer.useContainer()

    return (
        <Box w="100%" border="solid rgba(98, 126, 234, 0.6) 1px" borderRadius="10px" p={6}>
            <Heading w="full" size="md">
                Account Summary
            </Heading>
            <AccountInfoTable
                myAccountInfo={currentMyAccountInfo}
                marketState={currentMarketState}
                exchangeState={currentExchangeState}
            />
        </Box>
    )
}

export default Summary
