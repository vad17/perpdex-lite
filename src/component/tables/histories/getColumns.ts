export function getDepositedColumn() {
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

export function getWithdrawnColumn() {
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
            Header: "Withdrawn Amount",
            accessor: "amount",
        },
    ]
}

export function getLiquidityAddedExchangeColumn() {
    return [
        {
            Header: "Time",
            accessor: "time",
        },
        {
            Header: "Trader",
            accessor: "trader",
        },
        // {
        //     Header: "Market",
        //     accessor: "market",
        // },
        {
            Header: "Liquidity",
            accessor: "liquidity",
        },
    ]
}
