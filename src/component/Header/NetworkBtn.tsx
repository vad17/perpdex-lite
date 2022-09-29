import React, { useCallback, useEffect, useState } from "react"
import {
    Box,
    Center,
    HStack,
    Image,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    useMediaQuery,
} from "@chakra-ui/react"
import { NotAllowedIcon, TriangleDownIcon } from "@chakra-ui/icons"
import Button from "component/base/Button"
import { CurrencyIcon } from "component/Icon"
import { networkConfigs, networks, AddEthereumChainParameter } from "constant/network"
import { Connection } from "container/connection"
import { useWeb3React } from "@web3-react/core"
import _ from "lodash"

function NetworkBtn() {
    const isMobileAndTabletScreen = useMediaQuery("(max-width: 1024px)")

    const { chainId } = Connection.useContainer()

    const { library } = useWeb3React()

    const [injectedSupportedNetwork, setInjectedSupportedNetwork] = useState<boolean>(false)

    const getInjectedChainID = async () => {
        if (window && (window as any).ethereum) {
            const injectedChainID = await window.ethereum.request({ method: "eth_chainId" })
            _.forIn(networks, (network: AddEthereumChainParameter) => {
                if (network.chainId === injectedChainID) {
                    setInjectedSupportedNetwork(true)
                    return
                }
            })
            return
        }
        setInjectedSupportedNetwork(false)
    }

    useEffect(() => {
        getInjectedChainID()
    }, [])

    const injectedWalletHandler = useCallback(async (chainId: string) => {
        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: networks[chainId].chainId }],
            })
            getInjectedChainID()
        } catch (err: any) {
            if (err.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [{ ...networks[chainId] }],
                    })
                    getInjectedChainID()
                } catch (error) {
                    console.error(error)
                }
            }
        }
    }, [])

    const handleOnClick = useCallback(
        async (chainId: string) => {
            try {
                if (window && (window as any).ethereum) {
                    // browser injected wallet
                    injectedWalletHandler(chainId)
                    return
                }
                if (!library.provider) console.error("error")
                await library.provider.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: networks[chainId].chainId }],
                })
            } catch (err: any) {
                // 4902 error code indicates the chain is missing on the wallet
                if (err.code === 4902) {
                    try {
                        await library.provider.request({
                            method: "wallet_addEthereumChain",
                            params: [{ ...networks[chainId] }],
                        })
                    } catch (error) {
                        console.error(error)
                    }
                }
            }
        },
        [injectedWalletHandler, library],
    )

    return (
        <Popover trigger="hover">
            <PopoverTrigger>
                <Center pl="4" _hover={{ opacity: "0.9", cursor: "pointer" }}>
                    <Button
                        text={
                            isMobileAndTabletScreen[0]
                                ? ""
                                : chainId && _.keys(networkConfigs).includes(String(chainId))
                                ? networkConfigs[chainId].name
                                : injectedSupportedNetwork
                                ? "Not Connected"
                                : "Switch Network"
                        }
                        customType={injectedSupportedNetwork ? "base-dark" : "outline-red"}
                        size="sm"
                        leftIcon={
                            chainId && _.keys(networkConfigs).includes(String(chainId)) ? (
                                networkConfigs[chainId].iconUrl ? (
                                    <Image src={networkConfigs[chainId].iconUrl} boxSize={5} />
                                ) : (
                                    <CurrencyIcon symbol={networkConfigs[chainId].nativeTokenSymbol} boxSize={5} />
                                )
                            ) : injectedSupportedNetwork ? undefined : (
                                <NotAllowedIcon boxSize={4} mb="1px" />
                            )
                        }
                        rightIcon={<TriangleDownIcon boxSize={4} mb="1px" />}
                        mr="4"
                        borderRadius="10px"
                    />
                </Center>
            </PopoverTrigger>
            <PopoverContent p={2} transform="translate3d(0px, -12px, 0px) !important" bg="#181B41">
                <PopoverHeader borderBottom="0px none">Select a network</PopoverHeader>
                <PopoverBody>
                    <Box>
                        {_.keys(networkConfigs).map(key => (
                            <HStack
                                key={key}
                                p={2}
                                mb={2}
                                borderRadius="10px"
                                _hover={{ cursor: "pointer" }}
                                backgroundColor={chainId && chainId === Number(key) ? "#050217" : "#181B41"}
                                onClick={() => {
                                    handleOnClick(key)
                                }}
                            >
                                {networkConfigs[key].iconUrl ? (
                                    <Image src={networkConfigs[key].iconUrl} boxSize={5} />
                                ) : (
                                    <CurrencyIcon symbol={networkConfigs[key].nativeTokenSymbol} boxSize={5} />
                                )}
                                <Box>{networkConfigs[key].name}</Box>
                            </HStack>
                        ))}
                    </Box>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}

export default NetworkBtn
