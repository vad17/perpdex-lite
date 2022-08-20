import { useCallback, useState } from "react"
import { createContainer } from "unstated-next"

interface CancelOrderModalState {
    isBid: boolean
    orderId: number
}

function useModal() {
    const [walletModalIsOpen, setWalletModalIsOpen] = useState<boolean>(false)
    const [lpModalIsOpen, setLpModalIsOpen] = useState<boolean>(false)
    const [removeLiquidityModalIsOpen, setRemoveLiquidityModalIsOpen] = useState<boolean>(false)
    const [positionCloseModalIsOpen, setPositionCloseModalIsOpen] = useState<boolean>(false)
    const [cancelOrderModalIsOpen, setCancelOrderModalIsOpen] = useState<boolean>(false)
    const [cancelOrderModalState, setCancelOrderModalState] = useState<CancelOrderModalState>({
        isBid: false,
        orderId: 0,
    })

    const toggleWalletModal = useCallback(() => {
        setWalletModalIsOpen(!walletModalIsOpen)
    }, [walletModalIsOpen])

    const toggleLpModal = useCallback(() => {
        setLpModalIsOpen(!lpModalIsOpen)
    }, [lpModalIsOpen])

    const toggleRemoveLiquidityModal = useCallback(() => {
        setRemoveLiquidityModalIsOpen(!removeLiquidityModalIsOpen)
    }, [removeLiquidityModalIsOpen])

    const togglePositionCloseModal = useCallback(() => {
        setPositionCloseModalIsOpen(!positionCloseModalIsOpen)
    }, [positionCloseModalIsOpen])

    const toggleCancelOrderModal = useCallback(
        (isBid?: boolean, orderId?: number) => {
            setCancelOrderModalState({ isBid: isBid || false, orderId: orderId || 0 })
            setCancelOrderModalIsOpen(!cancelOrderModalIsOpen)
        },
        [cancelOrderModalIsOpen],
    )

    return {
        walletModalIsOpen,
        lpModalIsOpen,
        removeLiquidityModalIsOpen,
        positionCloseModalIsOpen,
        cancelOrderModalIsOpen,
        cancelOrderModalState,
        actions: {
            toggleWalletModal,
            toggleLpModal,
            toggleRemoveLiquidityModal,
            togglePositionCloseModal,
            toggleCancelOrderModal,
        },
    }
}

export const Modal = createContainer(useModal)
