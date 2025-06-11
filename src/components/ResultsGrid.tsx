import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  Badge,
  VStack,
  HStack,
  IconButton,
  Tooltip,
  useColorModeValue,
  useClipboard,
  Center,
} from '@chakra-ui/react'
import { CopyIcon, CheckIcon } from '@chakra-ui/icons'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

interface Result {
  temperature: number
  maxTokens: number
  presencePenalty: number
  frequencyPenalty: number
  output: string
}

interface ResultsGridProps {
  results: Result[]
}

export function ResultsGrid({ results }: ResultsGridProps) {
  const bgColor = useColorModeValue('white', 'gray.800')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const textColor = useColorModeValue('gray.500', 'gray.400')

  if (results.length === 0) {
    return (
      <Box minH="calc(100vh - 300px)" display="flex" alignItems="center" justifyContent="center">
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          textAlign="center"
          p={8}
        >
          <Text color={textColor} fontSize="lg">
            No results yet. Generate some outputs to see the comparison.
          </Text>
        </MotionBox>
      </Box>
    )
  }

  return (
    <Box minH="calc(100vh - 300px)">
      <VStack spacing={4} align="stretch">
        <TableContainer>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Parameters</Th>
                <Th>Output</Th>
              </Tr>
            </Thead>
            <Tbody>
              {results.map((result, index) => {
                const { onCopy, hasCopied } = useClipboard(result.output)
                
                return (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    style={{
                      backgroundColor: bgColor,
                    }}
                  >
                    <Td width="30%">
                      <VStack align="start" spacing={2}>
                        <HStack>
                          <Badge colorScheme="blue" variant="subtle" px={2} py={1} borderRadius="full">
                            Temperature: {result.temperature}
                          </Badge>
                        </HStack>
                        <HStack>
                          <Badge colorScheme="green" variant="subtle" px={2} py={1} borderRadius="full">
                            Max Tokens: {result.maxTokens}
                          </Badge>
                        </HStack>
                        <HStack>
                          <Badge colorScheme="purple" variant="subtle" px={2} py={1} borderRadius="full">
                            Presence: {result.presencePenalty}
                          </Badge>
                        </HStack>
                        <HStack>
                          <Badge colorScheme="orange" variant="subtle" px={2} py={1} borderRadius="full">
                            Frequency: {result.frequencyPenalty}
                          </Badge>
                        </HStack>
                      </VStack>
                    </Td>
                    <Td>
                      <Box position="relative">
                        <Box
                          p={3}
                          borderRadius="md"
                          bg={bgColor}
                          maxHeight="200px"
                          overflowY="auto"
                          borderWidth={1}
                          borderColor={borderColor}
                          transition="all 0.2s"
                          _hover={{ borderColor: 'blue.200', shadow: 'sm' }}
                        >
                          <HStack justify="space-between" mb={2}>
                            <Badge colorScheme="blue" variant="subtle">
                              Result #{results.length - index}
                            </Badge>
                            <Tooltip label={hasCopied ? 'Copied!' : 'Copy output'}>
                              <IconButton
                                aria-label="Copy output"
                                icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
                                onClick={onCopy}
                                size="xs"
                                variant="ghost"
                              />
                            </Tooltip>
                          </HStack>
                          <Text
                            fontSize="sm"
                            whiteSpace="pre-wrap"
                          >
                            {result.output}
                          </Text>
                        </Box>
                      </Box>
                    </Td>
                  </motion.tr>
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
    </Box>
  )
} 