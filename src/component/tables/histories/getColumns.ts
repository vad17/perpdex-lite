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

export function getLiquidityRemovedExchangeColumn() {
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
            Header: "Liquidator",
            accessor: "liquidator",
        },
        {
            Header: "Liquidity",
            accessor: "liquidity",
        },
        {
            Header: "Realized PNL",
            accessor: "realizedPnl",
        },
    ]
}

export function getPositionChangedColumn() {
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
            Header: "Realized PNL",
            accessor: "realizedPnl",
        },
        {
            Header: "Protocol Fee",
            accessor: "protocolFee",
        },
    ]
}
