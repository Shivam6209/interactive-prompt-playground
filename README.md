# Interactive Prompt Playground

A user-configurable prompt playground for experimenting with OpenAI's GPT models.

🚀 **Try it out**: [Interactive Prompt Playground](https://interactive-prompt-playground-sigma.vercel.app/)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key to the `.env` file:
   ```env
   VITE_OPENAI_API_KEY=your_api_key_here
   ```

## Running the Application

```bash
npm run dev
```

## Features

- Model selection (GPT-3.5 Turbo)
- Parameter control:
  - Temperature (0.0 - 2.0)
  - Max tokens (1 - 1000)
  - Presence penalty (-2.0 - 2.0)
  - Frequency penalty (-2.0 - 2.0)
- System and user prompt customization
- Results comparison grid
- Copy functionality for outputs
- Interactive UI with animations

## Security Note

Never commit your API keys or sensitive information to version control. The `.env` file is ignored by git to prevent accidental exposure of sensitive data.

## Usage

1. Select your desired model (GPT-3.5-Turbo)
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
