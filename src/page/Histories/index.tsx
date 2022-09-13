import { useMemo } from "react"
import { VStack, Text } from "@chakra-ui/react"
import { Heading } from "@chakra-ui/react"
import FrameContainer from "component/frames/FrameContainer"
import { Connection } from "container/connection"
import { networkConfigs } from "constant/network"
import { getDepositedsQuery } from "queries/account"
import { useThegraphQuery } from "hook/useThegraphQuery"
import { cleanUpDepositeds } from "util/queries"
import HistoriesTable from "component/tables/histories"
import { HistoryColumn } from "constant/types"
import { Column } from "react-table"

function Histories() {
    const { chainId, account } = Connection.useContainer()

    const networkConfig = networkConfigs[chainId || 280] // 280 for zkSync

    const depositedsResults = useThegraphQuery(chainId, getDepositedsQuery, { fetchPolicy: "network-only" })

    const data = useMemo(() => {
        if (depositedsResults.loading || depositedsResults.error) return []
        const allData = cleanUpDepositeds(depositedsResults.data)

        return allData
    }, [depositedsResults.data, depositedsResults.error, depositedsResults.loading])

    console.log("@@@@ data", depositedsResults)

    const columns: Column<HistoryColumn>[] = useMemo(
        () => [
            {
                Header: "Time",
                accessor: "time",
            },
            {
                Header: "Trader",
                accessor: "trader",
            },
            {
                Header: "Deposit Amount",
                accessor: "amount",
            },
        ],
        [],
    )

    return (
        <FrameContainer>
            <VStack w="100%">
                <VStack w="100%" alignItems="normal">
                    <Heading as="h2" size="lg" color="#627EEA">
                        Trading Histories
                    </Heading>
                    <Text>Latest trading events are queired and displayed as table</Text>
                </VStack>
                {data && data.length > 0 && account && (
                    <HistoriesTable columns={columns} data={data} account={account} />
                )}
            </VStack>
        </FrameContainer>
    )
}

export default Histories
