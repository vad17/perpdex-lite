import { useCallback, useMemo } from "react"
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import { Transaction } from "container/connection/transaction"
import { Modal as ModalContainer } from "container/modal"
import { PerpdexMarketContainer } from "../../../container/connection/perpdexMarketContainer"
import Modal from "component/base/Modal"
import Button from "component/base/Button"
import { LimitOrderInfo } from "../../../constant/types"
import Big from "big.js"

function CancelOrderModal() {
    const {
        cancelOrderModalIsOpen,
        cancelOrderModalState: { isBid, orderId },
        actions: { toggleCancelOrderModal },
    } = ModalContainer.useContainer()

    const { isLoading: isTxLoading } = Transaction.useContainer()
    const { currentMyAskInfos, currentMyBidInfos, cancelLimitOrder } = PerpdexExchangeContainer.useContainer()
    const { currentMarketState } = PerpdexMarketContainer.useContainer()

    const orderInfo: LimitOrderInfo | undefined = useMemo(() => {
        return (isBid ? currentMyBidInfos : currentMyAskInfos)[orderId]
    }, [isBid, currentMyAskInfos, currentMyBidInfos, orderId])

    const isDisabled = useMemo(() => {
        return !orderInfo
    }, [orderInfo])

    const priceDisplay = useMemo(() => {
        try {
            return currentMarketState.inverse ? Big(1).div(orderInfo?.price) : orderInfo?.price
        } catch {
            return orderInfo?.price
        }
    }, [orderInfo?.price, currentMarketState.inverse])

    const handleCloseMarket = useCallback(() => {
        if (orderInfo) {
            cancelLimitOrder(isBid, orderId)
        }
    }, [isBid, orderId])

    const handleCloseModal = useCallback(() => {
        toggleCancelOrderModal()
    }, [toggleCancelOrderModal])

    return useMemo(
        () => (
            <Modal
                headerText="Cancel Order"
                isOpen={cancelOrderModalIsOpen}
                onClose={handleCloseModal}
                size="md"
                body={
                    <div>
                        Side: {isBid !== currentMarketState.inverse ? "Buy" : "Sell"}
                        <br />
                        Size: {orderInfo?.base?.toFixed(7)} {currentMarketState.baseSymbol}
                        <br />
                        Price: {priceDisplay?.toFixed(7)}
                    </div>
                }
                footer={
                    <Button
                        text="Confirm"
                        customType="base-blue"
                        onClick={handleCloseMarket}
                        isDisabled={isDisabled}
                        isLoading={isTxLoading}
                    />
                }
            />
        ),
        [
            isBid,
            orderId,
            orderInfo?.base,
            priceDisplay,
            currentMarketState.inverse,
            cancelOrderModalIsOpen,
            handleCloseModal,
            currentMarketState.baseSymbol,
            handleCloseMarket,
            isDisabled,
            isTxLoading,
        ],
    )
}

export default CancelOrderModal
