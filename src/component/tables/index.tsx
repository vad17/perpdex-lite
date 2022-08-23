import { chakra, Th, Td, Text } from "@chakra-ui/react"

export const StyledTh = chakra(Th, {
    baseStyle: {
        color: "white",
        borderBottom: "0px none",
        fontSize: "lg",
    },
})

export const StyledTd = chakra(Td, {
    baseStyle: {
        borderBottom: "0px none",
    },
})

export const StyledAnnotation = chakra(Text, {
    baseStyle: {
        marginTop: "0px !important",
    },
})

// https://github.com/TanStack/table/blob/v7.0.0-beta.24/TYPESCRIPT.md
declare module "react-table" {
    export interface TableOptions<D extends object> extends UseSortByOptions<D> {}

    export interface TableInstance<D extends object = {}> extends UseSortByInstanceProps<D> {}

    export interface TableState<D extends object = {}> extends UseSortByState<D> {}

    export interface ColumnInstance<D extends object = {}> extends UseSortByColumnProps<D> {}
}
