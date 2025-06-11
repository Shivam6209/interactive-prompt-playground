import { useState } from 'react'
import {
  Box,
  Grid,
  GridItem,
  Textarea,
  Text,
  Container,
  Card,
  CardBody,
  FormLabel,
  FormControl,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useToast,
  VStack,
  Tooltip,
  IconButton,
  useClipboard,
  Badge,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { InfoIcon, CopyIcon, CheckIcon, DeleteIcon } from '@chakra-ui/icons'
import { motion } from 'framer-motion'
import { ResultsGrid } from './ResultsGrid'

const MotionCard = motion(Card)
const MotionButton = motion(Button)

interface PromptSettings {
  model: string
  temperature: number
  maxTokens: number
  presencePenalty: number
  frequencyPenalty: number
  systemPrompt: string
  userPrompt: string
}

interface Result {
  temperature: number
  maxTokens: number
  presencePenalty: number
  frequencyPenalty: number
  output: string
}

const defaultSettings: PromptSettings = {
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 150,
  presencePenalty: 0,
  frequencyPenalty: 0,
  systemPrompt: 'You are a helpful assistant that writes product descriptions.',
  userPrompt: 'Write a product description for the latest iPhone.',
}

const tooltips = {
  temperature: 'Controls randomness: 0 is focused, 1 is balanced, 2 is creative',
  maxTokens: 'Maximum length of the generated response',
  presencePenalty: 'Reduces repetition of topics: -2 to 2',
  frequencyPenalty: 'Reduces repetition of specific words: -2 to 2',
}

export function PromptPlayground() {
  const [settings, setSettings] = useState<PromptSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(false)
  const [output, setOutput] = useState<string>('')
  const [results, setResults] = useState<Result[]>([])
  const toast = useToast()
  const { hasCopied, onCopy } = useClipboard(output)
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')

  const handleSettingChange = (
    key: keyof PromptSettings,
    value: string | number
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const clearResults = () => {
    setResults([])
    toast({
      title: 'Results cleared',
      status: 'info',
      duration: 2000,
    })
  }

  const generateResponse = async () => {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      toast({
        title: 'API Key Missing',
        description: 'Please add your OpenAI API key to the .env file',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: settings.model,
          messages: [
            { role: 'system', content: settings.systemPrompt },
            { role: 'user', content: settings.userPrompt },
          ],
          temperature: settings.temperature,
          max_tokens: settings.maxTokens,
          presence_penalty: settings.presencePenalty,
          frequency_penalty: settings.frequencyPenalty,
        }),
      })

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error.message)
      }
      const newOutput = data.choices[0].message.content
      setOutput(newOutput)
      
      setResults((prev) => [
        ...prev,
        {
          temperature: settings.temperature,
          maxTokens: settings.maxTokens,
          presencePenalty: settings.presencePenalty,
          frequencyPenalty: settings.frequencyPenalty,
          output: newOutput,
        },
      ])

      toast({
        title: 'Response generated',
        status: 'success',
        duration: 2000,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="container.xl" p={4}>
      <Tabs variant="enclosed" colorScheme="blue" isLazy>
        <TabList>
          <Tab _selected={{ bg: bgColor, borderColor: borderColor }}>
            <HStack spacing={2}>
              <Text>Playground</Text>
              <Badge colorScheme="blue" variant="subtle">Active</Badge>
            </HStack>
          </Tab>
          <Tab _selected={{ bg: bgColor, borderColor: borderColor }}>
            <HStack spacing={2}>
              <Text>Results Comparison</Text>
              <Badge colorScheme="green">{results.length}</Badge>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={4}>
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={8}>
              <GridItem>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  bg={bgColor}
                  borderColor={borderColor}
                  _hover={{ shadow: 'md' }}
                >
                  <CardBody>
                    <VStack spacing={6} align="stretch">
                      <FormControl>
                        <FormLabel>Model</FormLabel>
                        <Select
                          value={settings.model}
                          onChange={(e) => handleSettingChange('model', e.target.value)}
                          bg={bgColor}
                          _hover={{ bg: hoverBg }}
                        >
                          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                          <option value="gpt-4">GPT-4</option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <HStack justify="space-between">
                          <FormLabel mb={0}>Temperature ({settings.temperature})</FormLabel>
                          <Tooltip label={tooltips.temperature}>
                            <InfoIcon />
                          </Tooltip>
                        </HStack>
                        <Slider
                          value={settings.temperature}
                          min={0}
                          max={2}
                          step={0.1}
                          onChange={(value) => handleSettingChange('temperature', value)}
                        >
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb />
                        </Slider>
                      </FormControl>

                      <FormControl>
                        <HStack justify="space-between">
                          <FormLabel mb={0}>Max Tokens</FormLabel>
                          <Tooltip label={tooltips.maxTokens}>
                            <InfoIcon />
                          </Tooltip>
                        </HStack>
                        <NumberInput
                          value={settings.maxTokens}
                          min={1}
                          max={1000}
                          onChange={(_, value) => handleSettingChange('maxTokens', value)}
                        >
                          <NumberInputField bg={bgColor} _hover={{ bg: hoverBg }} />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>

                      <FormControl>
                        <HStack justify="space-between">
                          <FormLabel mb={0}>Presence Penalty ({settings.presencePenalty})</FormLabel>
                          <Tooltip label={tooltips.presencePenalty}>
                            <InfoIcon />
                          </Tooltip>
                        </HStack>
                        <Slider
                          value={settings.presencePenalty}
                          min={-2}
                          max={2}
                          step={0.1}
                          onChange={(value) => handleSettingChange('presencePenalty', value)}
                        >
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb />
                        </Slider>
                      </FormControl>

                      <FormControl>
                        <HStack justify="space-between">
                          <FormLabel mb={0}>Frequency Penalty ({settings.frequencyPenalty})</FormLabel>
                          <Tooltip label={tooltips.frequencyPenalty}>
                            <InfoIcon />
                          </Tooltip>
                        </HStack>
                        <Slider
                          value={settings.frequencyPenalty}
                          min={-2}
                          max={2}
                          step={0.1}
                          onChange={(value) => handleSettingChange('frequencyPenalty', value)}
                        >
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb />
                        </Slider>
                      </FormControl>

                      <FormControl>
                        <FormLabel>System Prompt</FormLabel>
                        <Textarea
                          value={settings.systemPrompt}
                          onChange={(e) => handleSettingChange('systemPrompt', e.target.value)}
                          rows={3}
                          resize="vertical"
                          bg={bgColor}
                          _hover={{ bg: hoverBg }}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>User Prompt</FormLabel>
                        <Textarea
                          value={settings.userPrompt}
                          onChange={(e) => handleSettingChange('userPrompt', e.target.value)}
                          rows={3}
                          resize="vertical"
                          bg={bgColor}
                          _hover={{ bg: hoverBg }}
                        />
                      </FormControl>

                      <MotionButton
                        colorScheme="blue"
                        onClick={generateResponse}
                        isLoading={isLoading}
                        loadingText="Generating..."
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Generate
                      </MotionButton>
                    </VStack>
                  </CardBody>
                </MotionCard>
              </GridItem>

              <GridItem>
                <MotionCard
                  h="100%"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  bg={bgColor}
                  borderColor={borderColor}
                  _hover={{ shadow: 'md' }}
                >
                  <CardBody>
                    <HStack justify="space-between" mb={4}>
                      <Text fontWeight="bold">Output</Text>
                      <HStack>
                        <Tooltip label={hasCopied ? 'Copied!' : 'Copy output'}>
                          <IconButton
                            aria-label="Copy output"
                            icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
                            onClick={onCopy}
                            size="sm"
                            variant="ghost"
                          />
                        </Tooltip>
                      </HStack>
                    </HStack>
                    <Box
                      p={4}
                      borderWidth={1}
                      borderRadius="md"
                      minHeight="200px"
                      bg={hoverBg}
                      overflowY="auto"
                      maxHeight="600px"
                      borderColor={borderColor}
                      transition="all 0.2s"
                      _hover={{ borderColor: 'blue.200' }}
                    >
                      <Text whiteSpace="pre-wrap">{output || 'Output will appear here...'}</Text>
                    </Box>
                  </CardBody>
                </MotionCard>
              </GridItem>
            </Grid>
          </TabPanel>

          <TabPanel p={4}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              bg={bgColor}
              borderColor={borderColor}
              _hover={{ shadow: 'md' }}
              minH="200px"
            >
              <CardBody>
                <HStack justify="space-between" mb={4}>
                  <Text fontWeight="bold">Results History</Text>
                  {results.length > 0 && (
                    <Tooltip label="Clear all results">
                      <IconButton
                        aria-label="Clear results"
                        icon={<DeleteIcon />}
                        onClick={clearResults}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                      />
                    </Tooltip>
                  )}
                </HStack>
                <ResultsGrid results={results} />
              </CardBody>
            </MotionCard>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  )
} 