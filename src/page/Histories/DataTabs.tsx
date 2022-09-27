import { TabPanels, TabPanel, Tabs, TabList, Divider, chakra, Tab } from "@chakra-ui/react"
import HistoriesTable from "component/tables/histories"
import { HistoryData } from "constant/types"

function DataTabs() {
    const StyledTab = chakra(Tab, {
        baseStyle: {
            color: "gray.200",
            _selected: { color: "white", borderBottom: "1px solid #627EEA" },
        },
    })

    const dataTypes: HistoryData[] = [
        {
            title: "Deposit",
            type: "Deposited",
        },
        {
            title: "Withdrawn",
            type: "Withdrawn",
        },
        {
            title: "Liquidity Added",
            type: "LiquidityAddedExchanges",
        },
        {
            title: "Liquidity Removed",
            type: "LiquidityRemovedExchanges",
        },
        {
            title: "Position Changed",
            type: "PositionChangeds",
        },
        {
            title: "Orders",
            type: "Orders",
        },
        {
            title: "Limit Order Created",
            type: "LimitOrderCreatedExchanges",
        },
        {
            title: "Limit Order Settleds",
            type: "LimitOrderSettleds",
        },
    ]

    return (
        <Tabs isManual isLazy>
            <TabList>
                {dataTypes.map((data: HistoryData, index) => (
                    <StyledTab key={index}>{data.title}</StyledTab>
                ))}
            </TabList>
            <Divider borderColor="#627EEA" />
            <TabPanels>
                {dataTypes.map((data, index) => (
                    <TabPanel key={index} paddingX={0}>
                        <HistoriesTable historyDataType={data.type} />
                    </TabPanel>
                ))}
            </TabPanels>
        </Tabs>
    )
}

export default DataTabs
