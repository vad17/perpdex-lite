import { useMediaQuery, VStack } from "@chakra-ui/react"
import { IS_MAINNET } from "../../constant"
import FrameContainer from "component/frames/FrameContainer"
import AccountPanel from "../../component/AccountPanel"
import AccountInfoTable from "component/tables/AccountInfoTable"
import { PerpdexMarketContainer } from "../../container/connection/perpdexMarketContainer"
import { PerpdexExchangeContainer } from "../../container/connection/perpdexExchangeContainer"
import { User } from "../../container/connection/user"
import { AccountPerpdex } from "../../container/perpetual/account"
import Debug from "./Debug"
import AccountInfoTableMobile from "component/tables/AccountInfoTableMobile"

function Home() {
    const isMobileAndTabletScreen = useMediaQuery("(max-width: 1024px)")
    const {
        state: { address },
    } = User.useContainer()
    const {
        actions: { openAccountModal },
    } = AccountPerpdex.useContainer()
    const { currentMyAccountInfo } = PerpdexExchangeContainer.useContainer()
    const { currentMarketState } = PerpdexMarketContainer.useContainer()

    return (
        <FrameContainer removeMarginTop={isMobileAndTabletScreen[0]}>
            <VStack w="100%" alignItems={{ base: "center", lg: "normal" }}>
                <AccountPanel myAccountInfo={currentMyAccountInfo} marketState={currentMarketState} />
                {!isMobileAndTabletScreen[0] && (
                    <AccountInfoTable
                        accountAvailable={!!address}
                        openAccountModal={openAccountModal}
                        myAccountInfo={currentMyAccountInfo}
                        marketState={currentMarketState}
                    />
                )}
                {isMobileAndTabletScreen[0] && (
                    <AccountInfoTableMobile
                        accountAvailable={!!address}
                        openAccountModal={openAccountModal}
                        myAccountInfo={currentMyAccountInfo}
                        marketState={currentMarketState}
                    />
                )}
                {IS_MAINNET ? void 0 : <Debug />}
            </VStack>
        </FrameContainer>
    )
}

export default Home
