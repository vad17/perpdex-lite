import { useMemo } from "react"
import { HistoryColumn, HistoryDataType } from "constant/types"
import {
    getDepositedsQuery,
    getLiquidityAddedExchangesQuery,
    getLiquidityRemovedExchangesQuery,
    getWithdrawnsQuery,
} from "queries/account"
import { useThegraphQuery } from "hook/useThegraphQuery"
import {
    cleanUpDepositeds,
    cleanUpLiquidityAddedExchanges,
    cleanUpLiquidityRemovedExchanges,
    cleanUpPositionChangeds,
    cleanUpWithdrawn,
} from "util/queries"
import { Column } from "react-table"
import { Connection } from "container/connection"
import HistoriesTableWrapper from "./HistoriesTableWrapper"
import {
    getDepositedColumn,
    getLiquidityAddedExchangeColumn,
    getLiquidityRemovedExchangeColumn,
    getPositionChangedColumn,
    getWithdrawnColumn,
} from "./getColumns"
import { getPositionChangedsQuery } from "queries/trades"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"

const historyMethodsMap = {
    Deposited: {
        query: getDepositedsQuery,
        doMarketFilter: false,
        cleanUpMethod: cleanUpDepositeds,
        getColumn: getDepositedColumn,
    },
    Withdrawn: {
        query: getWithdrawnsQuery,
        doMarketFilter: false,
        cleanUpMethod: cleanUpWithdrawn,
        getColumn: getWithdrawnColumn,
    },
    LiquidityAddedExchanges: {
        query: getLiquidityAddedExchangesQuery,
        doMarketFilter: true,
        cleanUpMethod: cleanUpLiquidityAddedExchanges,
        getColumn: getLiquidityAddedExchangeColumn,
    },
    LiquidityRemovedExchanges: {
        query: getLiquidityRemovedExchangesQuery,
        doMarketFilter: true,
        cleanUpMethod: cleanUpLiquidityRemovedExchanges,
        getColumn: getLiquidityRemovedExchangeColumn,
    },
    PositionChangeds: {
        query: getPositionChangedsQuery,
        doMarketFilter: true,
        cleanUpMethod: cleanUpPositionChangeds,
        getColumn: getPositionChangedColumn,
    },
}

interface Props {
    historyDataType: HistoryDataType
}

function HistoriesTable({ historyDataType }: Props) {
    const { chainId, account } = Connection.useContainer()
    const { currentMarket } = PerpdexMarketContainer.useContainer()
    // const networkConfig = networkConfigs[chainId || 280] // 280 for zkSync

    const { query, doMarketFilter, cleanUpMethod, getColumn } = historyMethodsMap[historyDataType]

    const results = useThegraphQuery(chainId, query, {
        fetchPolicy: "network-only",
        variables: doMarketFilter
            ? {
                  markets: [currentMarket, currentMarket.toLowerCase()],
              }
            : undefined,
    })

    const data = useMemo(() => {
        if (results.error) console.error("query error: ", results.error)
        if (results.loading || results.error || !cleanUpMethod) return []
        console.log("@@@@ histories query data", results.data)
        const allData = cleanUpMethod(results.data)

        console.log("@@@@ histories clean allData", allData)

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
