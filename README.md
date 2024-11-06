# Prompt Security Home Assignment

## Project Description

Web application developed in Angular that provides an interactive interface for users to create and manage conversations with multiple providers.

## Features

- Create and manage multiple chats with different chat providers.
- Save chat conversations locally for future reference.
- Clean and responsive UI using Tailwind CSS and DaisyUI.

## Installation

To get started with the project, follow these steps:

1. **Clone the repository**

   ```sh
   git clone https://github.com/barel121/PromptSecurityHomeAssignment.git
   cd PromptSecurityHomeAssignment
   ```

2. **Install dependencies**
   Make sure you have [Node.js](https://nodejs.org/) installed. Then, run:

   ```sh
   npm install
   ```

3. **Set up environment variables**
   The project uses Angular's environment management system to manage API keys and other sensitive data.
   Update the `environment.ts` and `environment.prod.ts` files under the `src/environments` directory with your API keys. An example `environment.ts` file might look like:

   ```typescript
   export const environment = {
     production: false,
     anthropicAPIKey: "your_anthropic_api_key_here",
     openAiAPIKey: "your_openai_api_key_here",
   };
   ```

4. **Run the application**
   To start the development server, use the following command:
   ```sh
   npm start
   ```
   The application will be running at `http://localhost:4200`.

## Technologies Used

- **Angular 18**: The core framework used to build the front end.
- **Tailwind CSS & DaisyUI**: For a clean and modern user interface.
- **LocalStorage**: For persisting chat data across user sessions.
- **Iconify**: For adding icons to the UI.
