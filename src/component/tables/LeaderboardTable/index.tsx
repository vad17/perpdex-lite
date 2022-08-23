import { Table, Thead, Tbody, Tr, Th, Td, chakra } from "@chakra-ui/react"
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { useTable, useSortBy, Column } from "react-table"
import { useMemo } from "react"

interface ScoreData {
    rank: number
    trader: string
    totalTrades: string
    liquidations: number
    totalVolumes: string
    pnl: string
}

function LeaderboardTable() {
    // simple simlation data
    const data: ScoreData[] = useMemo(
        () =>
            Array.from(Array(1000).keys()).map((rank: number) => ({
                rank: rank + 1,
                trader: `trader${rank} address`,
                totalTrades: ((rank + 1) * 2).toLocaleString(),
                liquidations: Math.floor(rank / 10),
                totalVolumes: `${(100000 * Math.floor(1000 / (rank + 1))).toLocaleString()}ETH`,
                pnl: `${(1000000 * Math.floor(1000 / (rank + 1))).toLocaleString()} ETH`,
            })),
        [],
    )

    const columns: Column<ScoreData>[] = useMemo(
        () => [
            {
                Header: "Rank",
                accessor: "rank",
            },
            {
                Header: "Trader",
                accessor: "trader",
            },
            {
                Header: "Total Trades",
                accessor: "totalTrades",
            },
            {
                Header: "Liquidations",
                accessor: "liquidations",
            },
            {
                Header: "Total Volumes",
                accessor: "totalVolumes",
            },
            {
                Header: "PnL",
                accessor: "pnl",
            },
        ],
        [],
    )

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<ScoreData>(
        { columns, data },
        useSortBy,
    )

    return (
        <Table {...getTableProps()} height={1200} overflow="scroll" borderRadius={20}>
            <Thead position="sticky" top="0">
                {headerGroups.map(headerGroup => (
                    <Tr {...headerGroup.getHeaderGroupProps()} bg="blackAlpha.900">
                        {headerGroup.headers.map(column => (
                            <Th {...column.getHeaderProps(column.getSortByToggleProps())} position="sticky" top={0}>
                                {column.render("Header")}
                                <chakra.span pl="4">
                                    {column.isSorted ? (
                                        column.isSortedDesc ? (
                                            <TriangleDownIcon aria-label="sorted descending" />
                                        ) : (
                                            <TriangleUpIcon aria-label="sorted ascending" />
                                        )
                                    ) : null}
                                </chakra.span>
                            </Th>
                        ))}
                    </Tr>
                ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row)
                    return (
                        <Tr {...row.getRowProps()}>
                            {row.cells.map(cell => (
                                <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                            ))}
                        </Tr>
                    )
                })}
            </Tbody>
        </Table>
    )
}

export default LeaderboardTable
