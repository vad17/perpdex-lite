import { useMemo, useState } from "react"
import { ButtonGroup, Center, HStack, VStack } from "@chakra-ui/react"
import { Heading, Text } from "@chakra-ui/react"
import { ExternalLink } from "component/ExternalLink"
import FrameContainer from "component/frames/FrameContainer"
import LeaderboardTable from "component/tables/LeaderboardTable"
import { LeaderboardScoreData, LeaderboardTimeRange } from "constant/types"
import Button from "component/base/Button"

function Leaderboard() {
    const [timeRange, setTimeRange] = useState<LeaderboardTimeRange>("Last1Day")

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

    interface TimeRangeButtonProps {
        text: string
        type: LeaderboardTimeRange
    }

    const timeRangeButtons: TimeRangeButtonProps[] = useMemo(
        () => [
            {
                text: "1 Day",
                type: "Last1Day",
            },
            {
                text: "7 Day",
                type: "Last7Day",
            },
            {
                text: "30 Day",
                type: "Last30Day",
            },
            {
                text: "All",
                type: "All",
            },
        ],
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
                        {timeRangeButtons.map(values => (
                            <Button
                                key={values.type}
                                text={values.text}
                                customType={values.type === timeRange ? "base-blue" : "base-dark"}
                                onClick={() => setTimeRange(values.type)}
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
