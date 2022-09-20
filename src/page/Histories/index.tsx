import { VStack, Text } from "@chakra-ui/react"
import { Heading } from "@chakra-ui/react"
import FrameContainer from "component/frames/FrameContainer"
import DataTabs from "./DataTabs"

function Histories() {
    return (
        <FrameContainer>
            <VStack w="100%">
                <VStack w="100%" alignItems="normal">
                    <Heading as="h2" size="lg" color="#627EEA">
                        Trading Histories
                    </Heading>
                    <Text>Latest trading events are queired and displayed as table</Text>
                </VStack>

                <DataTabs />
            </VStack>
        </FrameContainer>
    )
}

export default Histories
