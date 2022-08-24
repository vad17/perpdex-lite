import { Table, Thead, Tbody, Tr, Th, Td, chakra } from "@chakra-ui/react"
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { useTable, useSortBy, Column } from "react-table"
import { useMemo } from "react"
import { LeaderboardScoreData } from "constant/types"

interface Props {
    data: LeaderboardScoreData[]
}

function LeaderboardTable({ data }: Props) {
    const columns: Column<LeaderboardScoreData>[] = useMemo(
        () => [
            {
                Header: "Rank",
                accessor: "rank",
            },
            {
                Header: "Trader",
                accessor: "trader",
            },
            // {
            //     Header: "Total Trades",
            //     accessor: "totalTrades",
            // },
            // {
            //     Header: "Liquidations",
            //     accessor: "liquidations",
            // },
            // {
            //     Header: "Total Volumes",
            //     accessor: "totalVolumes",
            // },
            {
                Header: "PnL Ratio",
                accessor: "pnlRatio",
            },
        ],
        [],
    )

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<LeaderboardScoreData>(
        { columns, data },
        useSortBy,
    )

    return (
        <Table
            {...getTableProps()}
            height={1200}
            overflow="scroll"
            borderColor="gray.700"
            borderWidth={1}
            sx={{ borderCollapse: "separate" }}
            borderRadius={10}
        >
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
