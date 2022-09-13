import { Route, Switch } from "react-router-dom"
import "focus-visible/dist/focus-visible"
import Home from "./page/Home"
import Trade from "./page/Trade"
import PositionToken from "./page/PositionToken"
import PositionTokenDetail from "./page/PositionTokenDetail"
import LiquidityProvider from "page/LiquidityProvider"
import Pools from "page/Pools"
import Leaderboard from "page/Leaderboard"
import Histories from "page/Histories"
import { Container, Divider, Box } from "@chakra-ui/react"
import Header from "./component/Header"
import WalletListModal from "component/modals/WalletModal"
import ClosePositionModal from "component/modals/ClosePositionModal"
import BlockedRegionModal from "component/modals/BlockedRegionModal"
// import UserAgreementModal from "component/modals/UserAgreementModal"
import AccountPerpdexModal from "component/modals/AccountModal"
import LiquidityProviderModal from "component/modals/LiquidityProviderModal"
import RemoveLiquidityModal from "component/modals/LiquidityProviderModal/RemoveLiquidityModal"
import CancelOrderModal from "./component/modals/CancelOrderModal"

export const App = () => {
    return (
        <Container maxW="container.2xl" pb={20} px={0}>
            <Header />
            <Divider
                borderColor="#627EEA"
                sx={{
                    "@media screen and (max-width: 61em)": {
                        display: "none",
                    },
                }}
            />
            <Box>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/trade" component={Trade} />
                    <Route exact path="/pools" component={Pools} />
                    <Route exact path="/pools/:marketAddress" component={LiquidityProvider} />
                    <Route exact path="/tokens" component={PositionToken} />
                    <Route exact path="/tokens/:marketAddress" component={PositionTokenDetail} />
                    <Route exact path="/leaderboard" component={Leaderboard} />
                    <Route exact path="/histories" component={Histories} />
                </Switch>
            </Box>
            <LiquidityProviderModal />
            <RemoveLiquidityModal />
            <WalletListModal />
            <ClosePositionModal />
            <CancelOrderModal />
            {/* <UserAgreementModal /> */}
            <AccountPerpdexModal />
            {/* NOTE: BlockedRegionModal should be in the last one */}
            <BlockedRegionModal />
        </Container>
    )
}
