import { useMemo } from "react"
import { HistoryColumn, HistoryDataType } from "constant/types"
import { getDepositedsQuery } from "queries/account"
import { useThegraphQuery } from "hook/useThegraphQuery"
import { cleanUpDepositeds } from "util/queries"
import { Column } from "react-table"
import { Connection } from "container/connection"
import HistoriesTableWrapper from "./HistoriesTableWrapper"

function getMethodsByHistoryDataType(type: HistoryDataType) {
    const query = type === "Deposited" ? getDepositedsQuery : undefined

    const cleanUpMethod = type === "Deposited" ? cleanUpDepositeds : undefined

    const getColumn = type === "Deposited" ? getDepositedColumn : getDepositedColumn

    return {
        query,
        cleanUpMethod,
        getColumn,
    }
}

function getDepositedColumn() {
    return [
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
    ]
}

interface Props {
    historyDataType: HistoryDataType
}

function HistoriesTable({ historyDataType }: Props) {
    const { chainId, account } = Connection.useContainer()
    // const networkConfig = networkConfigs[chainId || 280] // 280 for zkSync

    const { query, cleanUpMethod, getColumn } = getMethodsByHistoryDataType(historyDataType)

    const results = useThegraphQuery(chainId, query, { fetchPolicy: "network-only" })

    const data = useMemo(() => {
        if (results.loading || results.error || !cleanUpMethod) return []
        const allData = cleanUpMethod(results.data)

        return allData as any[]
    }, [cleanUpMethod, results.data, results.error, results.loading])

    const columns: Column<HistoryColumn>[] = useMemo(() => getColumn() as Column<HistoryColumn>[], [getColumn])

    return (
        <>
            {account && columns && data && data.length > 0 && (
                <HistoriesTableWrapper columns={columns} data={data} account={account} />
            )}
        </>
    )
}

export default HistoriesTable
