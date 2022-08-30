import { Table, Thead, Tbody, Tr, Th, Td, chakra } from "@chakra-ui/react"
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { useTable, useSortBy, Column } from "react-table"
import { useMemo } from "react"
import { LeaderboardScoreUnit } from "constant/types"

interface Props {
    data: LeaderboardScoreUnit[]
    account: string
}

function LeaderboardTable({ data, account }: Props) {
    const columns: Column<LeaderboardScoreUnit>[] = useMemo(
        () => [
            {
                Header: "PnL Rank",
                accessor: "pnlRank",
            },
            {
                Header: "Trader",
                accessor: "traderDom",
            },
            {
                Header: "Deposit",
                accessor: "deposit",
            },
            {
                Header: "Profit",
                accessor: "profit",
            },
            {
                Header: "PnL Ratio",
                accessor: "pnlRatioString",
            },
        ],
        [],
    )

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<LeaderboardScoreUnit>(
        { columns, data },
        useSortBy,
    )

    return (
        <Table
            {...getTableProps()}
            overflow="scroll"
            borderColor="gray.700"
            borderWidth="1px 1px 0 1px"
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

                    const isGoldRank = row.original.pnlRank && row.original.pnlRank <= 10
                    return (
                        <Tr
                            {...row.getRowProps()}
                            bgColor={
                                row.original.trader.toLowerCase() === account.toLowerCase()
                                    ? "#20296A"
                                    : "blackAlpha.900"
                            }
                            color={isGoldRank ? "#FFD700" : "white"}
                            _hover={{ opacity: 0.8 }}
                        >
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
