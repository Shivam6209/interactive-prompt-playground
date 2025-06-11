import { Box, Container, Heading, VStack } from '@chakra-ui/react'
import { PromptPlayground } from './components/PromptPlayground'

function App() {
  return (
    <Box minH="100vh" bg="gray.50" pb={8}>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="xl" textAlign="center">
            Interactive Prompt Playground
          </Heading>
          <Box flex="1">
            <PromptPlayground />
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default App
