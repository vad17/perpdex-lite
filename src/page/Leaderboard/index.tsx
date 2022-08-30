import { useMemo, useState } from "react"
import { ButtonGroup, Center, HStack, VStack } from "@chakra-ui/react"
import { Heading, Text } from "@chakra-ui/react"
import { ExternalLink } from "component/ExternalLink"
import FrameContainer from "component/frames/FrameContainer"
import LeaderboardTable from "component/tables/LeaderboardTable"
import Button from "component/base/Button"
import { Connection } from "container/connection"
import { getProfitRatiosQuery } from "queries/leaderboard"
import { useThegraphQuery } from "hook/useThegraphQuery"
// import { getTimestampBySubtractDays } from "util/time"
import { networkConfigs } from "constant/network"
import { cleanUpProfitRatios } from "util/leaderboard"
import { AiOutlineReload } from "react-icons/ai"
import _ from "lodash"
import { LeaderboardScoreUnit } from "constant/types"

function Leaderboard() {
    const { chainId, account } = Connection.useContainer()
    const [filterType, setFilterType] = useState<string>("")
    const filterTypes = ["Gold", "Consolation", "You", "All"]

    const networkConfig = networkConfigs[chainId || 280] // 280 for zkSync

    const profitRatiosResults = useThegraphQuery(chainId, getProfitRatiosQuery, { fetchPolicy: "network-only" })

    const data = useMemo(() => {
        if (profitRatiosResults.loading || profitRatiosResults.error) return []
        const allData = cleanUpProfitRatios(profitRatiosResults.data)?.map(values => ({
            ...values,
            traderDom: (
                <ExternalLink href={`${networkConfig.etherscanUrl}address/${values.trader}`}>
                    {values.trader === account ? `${values.trader} (YOU)` : values.trader}
                </ExternalLink>
            ),
        }))
        if (!allData || allData.length === 0) return []
        return (filterType === "Gold"
            ? _.take(allData, 10)
            : filterType === "Consolation"
            ? [allData[allData.length - 1]]
            : filterType === "You"
            ? [allData.filter(value => value.trader === account)]
            : allData) as LeaderboardScoreUnit[]
    }, [
        account,
        filterType,
        networkConfig.etherscanUrl,
        profitRatiosResults.data,
        profitRatiosResults.error,
        profitRatiosResults.loading,
    ])

    const refetchQuery = () => {
        profitRatiosResults.refetch()
    }

    return (
        <FrameContainer>
            <VStack w="100%" alignItems="normal">
                <Center mb="10">
                    <VStack w="100%">
                        <Heading as="h2" size="lg" color="#627EEA">
                            Trading Competiton on zkSync Testnet
                        </Heading>
                        <Text>Sep 1 14:00 UTC — Sep 8 14:00 UTC</Text>
                        <ExternalLink href="https://medium.com/perpdex/perpdex-trading-competition-round-1-eccfa4ebcfd1">
                            <Text color="yellow.base">Competition Details</Text>
                        </ExternalLink>
                    </VStack>
                </Center>
                <HStack justifyContent="flex-end">
                    <ButtonGroup>
                        {filterTypes.map(value => (
                            <Button
                                key={value}
                                text={value}
                                customType={value === filterType ? "base-blue" : "base-dark"}
                                onClick={() => setFilterType(value)}
                            />
                        ))}
                        <Button text="refresh" leftIcon={<AiOutlineReload />} onClick={() => refetchQuery()} />
                    </ButtonGroup>
                </HStack>
                {data && data.length > 0 && account && <LeaderboardTable data={data} account={account} />}
            </VStack>
        </FrameContainer>
    )
}

export default Leaderboard
