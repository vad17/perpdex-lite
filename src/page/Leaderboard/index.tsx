import { useEffect, useMemo, useState } from "react"
import { ButtonGroup, Center, HStack, VStack } from "@chakra-ui/react"
import { Heading, Text } from "@chakra-ui/react"
import { ExternalLink } from "component/ExternalLink"
import FrameContainer from "component/frames/FrameContainer"
import LeaderboardTable from "component/tables/LeaderboardTable"
import { LeaderboardScoreData } from "constant/types"
import Button from "component/base/Button"
import { Connection } from "container/connection"
import { getProfitRatiosQuery } from "queries/leaderboard"
import { useThegraphQuery } from "hook/useThegraphQuery"
import { getTimestampBySubtractDays } from "util/time"

function Leaderboard() {
    const { chainId } = Connection.useContainer()
    const [daysBefore, setDaysBefore] = useState<number>(1)
    const dasyBeforeOfStartTimeList = [1, 7, 30, -1]

    const profitRatiosResults = useThegraphQuery(chainId, getProfitRatiosQuery, {
        variables: {
            startedAtGt: getTimestampBySubtractDays(daysBefore),
        },
    })

    useEffect(() => {
        console.log("@@@ refetching profitRatiosResults with daysBefore:", daysBefore)
        profitRatiosResults.refetch({
            startedAtGt: getTimestampBySubtractDays(daysBefore),
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [daysBefore])

    const newData = useMemo(() => {
        if (profitRatiosResults.loading || profitRatiosResults.error) return []
        return profitRatiosResults.data
    }, [profitRatiosResults.data, profitRatiosResults.error, profitRatiosResults.loading])

    console.log("@@@@ profitRatiosResults data: ", newData)

    const data: LeaderboardScoreData[] = useMemo(
        () =>
            Array.from(Array(30).keys()).map((rank: number) => ({
                rank: rank + 1,
                trader: `trader${rank} address`,
                // totalTrades: ((rank + 1) * 2).toLocaleString(),
                // liquidations: Math.floor(rank / 10),
                // totalVolumes: `${(100000 * Math.floor(1000 / (rank + 1))).toLocaleString()}ETH`,
                pnlRatio: `${(1000000 * Math.floor(1000 / (rank + 1))).toLocaleString()} ETH`,
            })),
        [],
    )

    return (
        <FrameContainer>
            <VStack w="100%" alignItems="normal">
                <Center mb="10">
                    <VStack w="100%">
                        <Heading as="h2" size="lg" color="#627EEA">
                            Trading Competiton on zkSync Testnet
                        </Heading>
                        <Text>Aug 29 14:00 UTC — Sep 5 14:00 UTC</Text>
                        <ExternalLink href="https://perpdex.exchange/">
                            <Text color="yellow.base">Competition Rules</Text>
                        </ExternalLink>
                    </VStack>
                </Center>
                <HStack justifyContent="flex-end">
                    <ButtonGroup>
                        {dasyBeforeOfStartTimeList.map(value => (
                            <Button
                                key={value}
                                text={value === -1 ? "All" : `${value} Day`}
                                customType={value === daysBefore ? "base-blue" : "base-dark"}
                                onClick={() => setDaysBefore(value)}
                            />
                        ))}
                    </ButtonGroup>
                </HStack>
                <LeaderboardTable data={data} />
            </VStack>
        </FrameContainer>
    )
}

export default Leaderboard
