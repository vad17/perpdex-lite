import React from "react"
import { VStack, Flex, Box, HStack, Divider, Tabs, TabList, chakra, Tab, TabPanels, TabPanel } from "@chakra-ui/react"

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

function Trade() {
    // todo dividers are not appropriate height
    // const [height, setHeight] = useState<number | undefined>(0)
    const divRef = React.useRef<HTMLDivElement>(null)

    // useEffect(() => {
    //     if (divRef.current) {
    //         setHeight(divRef.current.offsetHeight)
    //     }
    // }, [])

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
                        <VStack alignItems="stretch">
                            <Box width={800} height={700}>
                                {isTechnicalChart ? <TechnicalChart /> : <LightWeightChart />}
                            </Box>
                        </VStack>
                        <Tabs variant="unstyled" size="md" isLazy>
                            <TabList my={2}>
                                <HStack w="100%" justifyContent="center">
                                    <StyledTab pt={1}>Order Book</StyledTab>
                                    <StyledTab pt={1}>Recent Trades</StyledTab>
                                </HStack>
                            </TabList>

                            <TabPanels>
                                {/* // size 渡す */}
                                <TabPanel p={0}>
                                    <OrderBook />
                                </TabPanel>
                                <TabPanel p={0}>
                                    <OrderHistory />
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
                    <PositionTab />
                </Box>
                <Box ref={divRef} w="100%">
                    <HStack spacing={8} justifyContent="flex-start">
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
                        </VStack>
                    </HStack>
                </Box>
            </Flex>
        </FrameContainer>
    )
}

export default Trade
