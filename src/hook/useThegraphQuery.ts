import { networkConfigs } from "../constant/network"
import { useQuery } from "@apollo/client"
import _ from "lodash"

const removeNodes = (obj: any): any => {
    if (_.isArray(obj)) {
        return _.map(obj, removeNodes)
    } else if (_.isObject(obj)) {
        const obj2 = obj as any
        if ("nodes" in obj2) {
            return removeNodes(obj2.nodes)
        } else {
            return _.mapValues(obj, removeNodes)
        }
    }

    return obj
}

export function useThegraphQuery(chainId: number | undefined, queryFunc: any, options: any) {
    const thegraphSchemaType = networkConfigs[chainId || ""]?.thegraphSchemaType || "thegraph"
    const result = useQuery(queryFunc(thegraphSchemaType), options)

    return {
        ...result,
        data: removeNodes(result.data),
    }
}
