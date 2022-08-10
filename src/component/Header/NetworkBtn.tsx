import React, { useCallback } from "react"
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
} from "@chakra-ui/react"
import { TriangleDownIcon } from "@chakra-ui/icons"
import Button from "component/base/Button"
import { CurrencyIcon } from "component/Icon"
import { networkConfigs, networks } from "constant/network"
import { Connection } from "container/connection"
import { useWeb3React } from "@web3-react/core"
import _ from "lodash"

function NetworkBtn() {
    const { chainId, active } = Connection.useContainer()

    const { library } = useWeb3React()

    const handleOnClick = useCallback(
        async (chainId: string) => {
            try {
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
        [library],
    )

    return (
        <Popover trigger="hover">
            <PopoverTrigger>
                <Center pl="4" _hover={{ opacity: "0.9", cursor: "pointer" }}>
                    <Button
                        text={
                            !active
                                ? "Not connected"
                                : chainId && _.keys(networkConfigs).includes(String(chainId))
                                ? networkConfigs[chainId].name
                                : "Unsupported Chain"
                        }
                        customType="base-dark"
                        size="sm"
                        leftIcon={
                            chainId && _.keys(networkConfigs).includes(String(chainId)) ? (
                                networkConfigs[chainId].iconUrl ? (
                                    <Image src={networkConfigs[chainId].iconUrl} boxSize={5} />
                                ) : (
                                    <CurrencyIcon symbol={networkConfigs[chainId].nativeTokenSymbol} boxSize={5} />
                                )
                            ) : undefined
                        }
                        rightIcon={<TriangleDownIcon boxSize={4} />}
                        mr="4"
                    />
                </Center>
            </PopoverTrigger>
            <PopoverContent p={2} transform="translate3d(0px, -12px, 0px) !important" bg="#181B41">
                <PopoverHeader borderBottom="0px none">Select a network</PopoverHeader>
                <PopoverBody>
                    <Box>
                        {_.keys(networkConfigs).map(key => (
                            <HStack
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
