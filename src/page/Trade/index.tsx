import React, { useEffect, useState } from "react"
import {
    VStack,
    Flex,
    Box,
    HStack,
    Divider,
    Tabs,
    TabList,
    chakra,
    Tab,
    TabPanels,
    TabPanel,
    useMediaQuery,
} from "@chakra-ui/react"

import ChartHead from "./ChartHead"
import FrameContainer from "component/frames/FrameContainer"
import TradeInput from "./TradeInput"
import PositionTab from "./PositionTab"
import LightWeightChart from "./LightWeightChart"
import OrderHistory from "./OrderHistory"
import AccountSummary from "./AccountSummary"
import OrderBook from "./OrderBook"
import TechnicalChart from "./TechnicalChart"
import { isTechnicalChart } from "../../constant"
import PositionTabMobile from "./PositionTabMobile"

function Trade() {
    const isMobileAndTabletScreen = useMediaQuery("(max-width: 1024px)")

    const chartWidth: number = 800
    const chartHeight: number = 700

    const tabListRef = React.useRef<HTMLDivElement>(null)

    const [height, setHeight] = useState<number>(chartHeight)

    useEffect(() => {
        if (tabListRef.current) {
            setHeight(chartHeight - tabListRef.current.offsetHeight)
        }
    }, [])

    const StyledTab = chakra(Tab, {
        baseStyle: {
            color: "gray.200",
            _selected: { color: "white", borderBottom: "1px solid #627EEA" },
        },
    })

    return (
        <FrameContainer removeMarginTop>
            <Flex direction={{ base: "column", lg: "row" }}>
                <Box flex="1">
                    <ChartHead />
                    <Flex direction={{ base: "column", lg: "row" }} alignItems="flex-start">
                        <Box
                            width={isMobileAndTabletScreen[0] ? "100%" : chartWidth}
                            height={isMobileAndTabletScreen[0] ? 400 : chartHeight}
                        >
                            {isTechnicalChart ? <TechnicalChart /> : <LightWeightChart />}
                        </Box>
                        <Tabs variant="unstyled" size="md" isLazy>
                            <TabList my={2} ref={tabListRef}>
                                <HStack w="100%" justifyContent="center">
                                    <StyledTab pt={1}>Order Book</StyledTab>
                                    <StyledTab pt={1}>Recent Trades</StyledTab>
                                </HStack>
                            </TabList>

                            <TabPanels>
                                <TabPanel p={0}>
                                    <OrderBook height={height} />
                                </TabPanel>
                                <TabPanel p={0}>
                                    <OrderHistory height={height} />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Flex>
                    <Divider
                        borderColor="#627EEA"
                        sx={{
                            "@media screen and (max-width: 61em)": {
                                display: "none",
                            },
                        }}
                    />
                    {!isMobileAndTabletScreen[0] && <PositionTab />}
                </Box>
                <Box w="100%">
                    <HStack spacing={{ base: 0, lg: 8 }} justifyContent="flex-start">
                        <Divider
                            orientation="vertical"
                            border="1px"
                            borderColor="rgba(98, 126, 234, 0.6)"
                            h="auto"
                            sx={{
                                "@media screen and (max-width: 61em)": {
                                    display: "none",
                                },
                            }}
                        />
                        <VStack spacing={10} p={0} pt={5} alignItems="flex-start">
                            <TradeInput />
                            <AccountSummary />
                            {isMobileAndTabletScreen[0] && <PositionTabMobile />}
                        </VStack>
                    </HStack>
                </Box>
            </Flex>
        </FrameContainer>
    )
}

export default Trade
