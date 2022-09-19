import { VStack, Text, TabPanels, TabPanel, Tabs, TabList, Divider, chakra, Tab } from "@chakra-ui/react"
import { Heading } from "@chakra-ui/react"
import FrameContainer from "component/frames/FrameContainer"
import HistoriesTable from "component/tables/histories"
import { HistoryData } from "constant/types"

function Histories() {
    const StyledTab = chakra(Tab, {
        baseStyle: {
            color: "gray.200",
            _selected: { color: "white", borderBottom: "1px solid #627EEA" },
        },
    })

    const dataTypes: HistoryData[] = [
        {
            title: "Deposit",
            type: "deposited",
        },
    ]

    return (
        <FrameContainer>
            <VStack w="100%">
                <VStack w="100%" alignItems="normal">
                    <Heading as="h2" size="lg" color="#627EEA">
                        Trading Histories
                    </Heading>
                    <Text>Latest trading events are queired and displayed as table</Text>
                </VStack>

                <Tabs>
                    <TabList>
                        {dataTypes.map(dataType => (
                            <StyledTab>{dataType.title}</StyledTab>
                        ))}
                    </TabList>
                    <Divider borderColor="#627EEA" />
                    <TabPanels>
                        <TabPanel paddingX={0}>
                            {dataTypes.map(dataType => (
                                <HistoriesTable historyDataType={dataType.type} />
                            ))}
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </VStack>
        </FrameContainer>
    )
}

export default Histories
