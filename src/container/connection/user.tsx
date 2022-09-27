import { identify, reset } from "../../lib/segment/base"
import { useCallback, useEffect, useReducer, useRef, useState } from "react"

import { AbstractConnector } from "@web3-react/abstract-connector"
import { validateSupportedChainId } from "../../connector"
import { STORAGE_KEY } from "../../constant"
import { SUPPORTED_WALLETS } from "constant/wallet"
import { createContainer } from "unstated-next"
import { logger } from "lib/bugsnag/logger"
import { useLocalStorage } from "../../hook/useLocalStorage"
import { useNotification } from "../../hook/useNotification"
import { usePrevious } from "../../hook/usePrevious"
import { Connection } from "."
import { UnsupportedChainIdError } from "@web3-react/core"

enum ACTIONS {
    LOGIN_REQUEST = "LOGIN_REQUEST",
    LOGIN_SUCCESS = "LOGIN_SUCCESS",
    LOGIN_FAIL = "LOGIN_FAIL",
    LOGOUT = "LOGOUT",
}

type ActionType =
    | { type: ACTIONS.LOGIN_REQUEST }
    | { type: ACTIONS.LOGIN_SUCCESS; payload: { address: string } }
    | { type: ACTIONS.LOGIN_FAIL }
    | { type: ACTIONS.LOGOUT }

const initialState = {
    isLoading: false,
    address: "",
}

export const User = createContainer(useUser)

const { CONNECTOR_ID } = STORAGE_KEY

function usePostLogout(onLogout: Function) {
    const { active } = Connection.useContainer()
    const previousSession = usePrevious(active)

    useEffect(() => {
        if (previousSession && !active) {
            // clear up state when users are logs out from wallet connect
            onLogout()
        }
    }, [previousSession, active, onLogout])
}

function useUser() {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { active, account, chainId, activate, deactivate } = Connection.useContainer()
    const [, setConnectorId] = useLocalStorage(CONNECTOR_ID.name, CONNECTOR_ID.defaultValue)
    const { notifyError, closeNotify } = useNotification()
    const wrongNetworkRef = useRef()

    // NOTE: this will be called after user logout out
    usePostLogout(() => {
        setConnectorId("")
        dispatch({ type: ACTIONS.LOGOUT })
        reset()
    })

    const logout = useCallback(() => {
        deactivate()
    }, [deactivate])

    const login = useCallback(
        (instance: AbstractConnector, connectorId: string, onActivate?: Function) => {
            dispatch({ type: ACTIONS.LOGIN_REQUEST })
            setConnectorId(connectorId)
            activate(
                instance,
                async e => {
                    // log out when user changed unsupported network in other protocols
                    if (e instanceof UnsupportedChainIdError) {
                        logout()
                    }
                    return
                },
                true,
            )
                .then(() => {
                    if (onActivate) {
                        onActivate()
                    }
                    logger.info("connect success")
                })
                .catch(err => {
                    setConnectorId("")
                    dispatch({ type: ACTIONS.LOGIN_FAIL })
                    logger.error(err)
                    notifyError({
                        title: "Switch a supported network in Metamask to connect",
                        position: "top-right",
                    })
                })
        },
        [setConnectorId, activate, logout, notifyError],
    )

    useEffect(() => {
        if (active && account && chainId) {
            dispatch({ type: ACTIONS.LOGIN_SUCCESS, payload: { address: account } })
            identify(account)

            const networkValidated = validateSupportedChainId(chainId)
            if (!networkValidated) {
                // @ts-ignore
                wrongNetworkRef.current = notifyError({
                    title: "Wrong network",
                    description: `Please switch network to rinkeby.`,
                    isClosable: true,
                    duration: null,
                })
            } else {
                if (wrongNetworkRef.current) {
                    closeNotify(wrongNetworkRef.current)
                }
            }
        }
    }, [account, active, chainId, notifyError, closeNotify])

    // auto login
    const [isTried, setIsTried] = useState(false)
    const [connectorId] = useLocalStorage(CONNECTOR_ID.name, CONNECTOR_ID.defaultValue)
    useEffect(() => {
        const connector = SUPPORTED_WALLETS.find(walletInfo => walletInfo.id === connectorId)?.connector
        if (!isTried && connector) {
            logger.info("auto login...")
            login(connector, connectorId)
            setIsTried(true)
        }
    }, [connectorId, isTried, login])

    return {
        state,
        actions: {
            login,
            logout,
        },
    }
}

function reducer(state: typeof initialState, action: ActionType) {
    switch (action.type) {
        case ACTIONS.LOGIN_REQUEST: {
            return { ...state, isLoading: true }
        }
        case ACTIONS.LOGIN_SUCCESS: {
            const { address } = action.payload
            return { ...state, isLoading: false, address }
        }
        case ACTIONS.LOGIN_FAIL: {
            return {
                ...state,
                isLoading: false,
            }
        }
        case ACTIONS.LOGOUT: {
            return {
                ...state,
                address: "",
            }
        }
        default:
            throw new Error()
    }
}
