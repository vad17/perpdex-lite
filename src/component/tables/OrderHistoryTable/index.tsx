import React from "react"
import { Thead, Table, Tr, Th, Tbody, Td, chakra, Text, Box } from "@chakra-ui/react"
import { OrderHistoryUnit } from "constant/types"
import { formattedNumberWithCommas } from "util/format"
import { formatTime, timezoneStr } from "util/time"

interface OrderHistoryTableState {
    title?: string
    baseSymbol: string
    priceUnitDisplay: string
    data: OrderHistoryUnit[] | undefined
    applyStripe?: boolean
    applyPXZero?: boolean
    height: number
}

function OrderHistoryTable({
    title,
    baseSymbol,
    priceUnitDisplay,
    data,
    applyStripe = false,
    applyPXZero = false,
    height,
}: OrderHistoryTableState) {
    const StyledTh = chakra(Th, {
        baseStyle: {
            color: "white",
            borderBottom: "0px none",
            // textTransform: "none",
        },
    })

    const StyledTd = chakra(Td, {
        baseStyle: {
            borderBottom: "0px none",
        },
    })

    return (
        <Box overflowY="auto" maxHeight={height}>
            {title && (
                <Text align="center" color={"gray.200"}>
                    {title}
                </Text>
            )}
            <Table variant="simple" overflowY="scroll">
                <Thead>
                    <Tr>
                        <StyledTh px={applyPXZero ? 0 : "24px"} w="35%">
                            Size({baseSymbol})
                        </StyledTh>
                        <StyledTh w="35%">Price({priceUnitDisplay})</StyledTh>
                        <StyledTh w="30%">Time({timezoneStr()})</StyledTh>
                    </Tr>
                </Thead>
                <Tbody>
                    {data &&
                        data.length > 0 &&
                        data.map((value: OrderHistoryUnit, index: number) => (
                            <Tr key={index} bg={applyStripe && index % 2 === 0 ? "rgba(98, 126, 234, 0.2)" : ""}>
                                <StyledTd
                                    color={value.isLongDisplay ? "green.300" : "red.300"}
                                    px={applyPXZero ? 0 : "24px"}
                                    py={1}
                                >
                                    {formattedNumberWithCommas(value.size)}
                                </StyledTd>
                                <StyledTd py={1}>{formattedNumberWithCommas(value.priceDisplay)}</StyledTd>
                                <StyledTd py={1}>{formatTime(value.time, true)}</StyledTd>
                            </Tr>
                        ))}
                </Tbody>
            </Table>
        </Box>
    )
}

export default OrderHistoryTable
