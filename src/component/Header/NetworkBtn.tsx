import React from "react"
import {
    Box,
    Center,
    HStack,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
} from "@chakra-ui/react"
import { TriangleDownIcon } from "@chakra-ui/icons"
import Button from "component/base/Button"
import { CurrencyIcon } from "component/Icon"
import { networkConfigs } from "constant/network"
import { Connection } from "container/connection"

function NetworkBtn() {
    const { chainId } = Connection.useContainer()
    return (
        <Popover trigger="hover" isLazy>
            <PopoverTrigger>
                <Center pl="4" _hover={{ opacity: "0.9", cursor: "pointer" }}>
                    <Button
                        text={chainId ? networkConfigs[chainId].name : "TEST"}
                        customType="base-dark"
                        size="sm"
                        leftIcon={
                            chainId ? (
                                <CurrencyIcon symbol={networkConfigs[chainId].nativeTokenSymbol} boxSize={6} />
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
                        {Object.keys(networkConfigs).map(key => (
                            <HStack
                                p={2}
                                mb={2}
                                borderRadius="10px"
                                _hover={{ cursor: "pointer" }}
                                backgroundColor={chainId && chainId === Number(key) ? "#050217" : "#181B41"}
                            >
                                <CurrencyIcon symbol={networkConfigs[key].nativeTokenSymbol} boxSize={6} />
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
