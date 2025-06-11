# Interactive Prompt Playground

An interactive web application for experimenting with OpenAI's GPT models and their parameters. This playground allows users to generate product descriptions while adjusting various parameters to understand how they affect the output.

## Features

- Model Selection (GPT-3.5-Turbo / GPT-4)
- Parameter Controls:
  - Temperature (0.0 - 2.0)
  - Max Tokens (1 - 1000)
  - Presence Penalty (-2.0 - 2.0)
  - Frequency Penalty (-2.0 - 2.0)
- System Prompt Configuration
- User Prompt Input
- Real-time Output Display
- Results Comparison Grid

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Select your desired model (GPT-3.5-Turbo or GPT-4)
2. Enter your system prompt and user prompt
3. Adjust the parameters:
   - Temperature: Controls randomness (0.0 = deterministic, 1.0 = creative)
   - Max Tokens: Limits response length
   - Presence Penalty: Reduces repetition of topics
   - Frequency Penalty: Reduces repetition of specific words
4. Click "Generate" to see the output
5. Results will be displayed in a comparison grid

## Parameter Effects Analysis

[This section will be updated with a 2-paragraph reflection on parameter effects after testing]
