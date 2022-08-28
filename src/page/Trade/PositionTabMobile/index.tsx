import { Tabs, TabList, Tab, TabPanels, TabPanel, chakra, Divider } from "@chakra-ui/react"
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import { Modal } from "container/modal"
import { useMemo } from "react"
import { PositionTableState } from "./../PositionTab/PositionTable"
import { PerpdexMarketContainer } from "../../../container/connection/perpdexMarketContainer"
// import OrderHistoryTable from "./OrderHistoryTable"
// import OrderTable, { OrderTableItem } from "./OrderTable"
// import _ from "lodash"
// import { LimitOrderInfo } from "../../../constant/types"
import PositionTableMobile from "./PositionTableMobile"

function PositionTab() {
    const { currentMyTakerPositions, currentMyAskInfos, currentMyBidInfos } = PerpdexExchangeContainer.useContainer()
    const { currentMarketState } = PerpdexMarketContainer.useContainer()
    const {
        actions: { togglePositionCloseModal, toggleCancelOrderModal },
    } = Modal.useContainer()

    const positionTableData: Omit<PositionTableState, "handleOnClick"> | undefined = useMemo(() => {
        if (currentMyTakerPositions) {
            return {
                marketState: currentMarketState,
                isLongDisplay: currentMyTakerPositions.isLongDisplay,
                positionQuantity: currentMyTakerPositions.positionQuantity.abs().toFixed(7),
                positionValue: currentMyTakerPositions.positionValue.abs().toFixed(7),
                entryPriceDisplay: currentMyTakerPositions.entryPriceDisplay,
                markPriceDisplay: currentMarketState.markPriceDisplay,
                liqPriceDisplay: currentMyTakerPositions.liqPriceDisplay,
                unrealizedPnl: currentMyTakerPositions.unrealizedPnl.toFixed(4),
            }
        }
        return undefined
    }, [currentMyTakerPositions, currentMarketState])

    // const orderItems: OrderTableItem[] = useMemo(() => {
    //     const infoToItem = (isBid: boolean, info: LimitOrderInfo, orderId: string): OrderTableItem => {
    //         const quantity = info.base
    //         return {
    //             isBid: currentMarketState.inverse ? !isBid : isBid,
    //             quantity: quantity,
    //             price: info.price,
    //             handleOnClick: () => {
    //                 toggleCancelOrderModal(isBid, +orderId)
    //             },
    //         }
    //     }
    //     return _.flatten([
    //         _.map(currentMyAskInfos, _.partial(infoToItem, false)),
    //         _.map(currentMyBidInfos, _.partial(infoToItem, true)),
    //     ])
    // }, [currentMarketState.inverse, currentMyAskInfos, currentMyBidInfos])

    const StyledTab = chakra(Tab, {
        baseStyle: {
            color: "gray.200",
            _selected: { color: "white", borderBottom: "1px solid #627EEA" },
        },
    })

    return (
        <Tabs variant="unstyled" mb="30px">
            <TabList my={2}>
                <StyledTab>Positions</StyledTab>
                {/* <StyledTab>Orders</StyledTab>
                <StyledTab>Trade History</StyledTab> */}
            </TabList>
            <Divider borderColor="#627EEA" />

            <TabPanels>
                <TabPanel>
                    {positionTableData && (
                        <PositionTableMobile
                            marketState={positionTableData.marketState}
                            isLongDisplay={positionTableData.isLongDisplay}
                            positionQuantity={positionTableData.positionQuantity}
                            positionValue={positionTableData.positionValue}
                            entryPriceDisplay={positionTableData.entryPriceDisplay}
                            markPriceDisplay={positionTableData.markPriceDisplay}
                            liqPriceDisplay={positionTableData.liqPriceDisplay}
                            unrealizedPnl={positionTableData.unrealizedPnl}
                            handleOnClick={togglePositionCloseModal}
                        />
                    )}
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

export default PositionTab
