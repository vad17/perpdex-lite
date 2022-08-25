import React, { useState } from "react"

import { Box, chakra, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import SideSwitcher from "component/base/SideSwitcher"
import MarketForm from "./MarketForm"
import LimitForm from "./LimitForm"

function TradeInput() {
    const [isBuyDisplay, setIsBuyDisplay] = useState<boolean>(true)

    const StyledTab = chakra(Tab, {
        baseStyle: {
            color: "gray.200",
            _selected: { color: "white" },
        },
    })

    return (
        <>
            <Box background="#181B41" borderRadius="10px" p={6}>
                <SideSwitcher
                    isBuy={isBuyDisplay}
                    longText="Buy/Long"
                    shortText="Sell/Short"
                    doSwitchToBuy={setIsBuyDisplay}
                />
                <Tabs variant="unstyled" isLazy>
                    <TabList my={2}>
                        <StyledTab pl="0px">Market</StyledTab>
                        <StyledTab>Limit</StyledTab>
                    </TabList>

                    <TabPanels>
                        <TabPanel p={0}>
                            <MarketForm isBuyDisplay={isBuyDisplay} />
                        </TabPanel>
                        <TabPanel p={0}>
                            <LimitForm isBuyDisplay={isBuyDisplay} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </>
    )
}

export default TradeInput
