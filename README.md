# Georgian Corruption Q&A

A single-page web application that provides a natural language interface for querying a document about alleged high-level corruption cases in Georgia. It uses the Google Gemini AI model to generate answers based exclusively on the provided text.

## Key Features

*   **AI-Powered Q&A:** Ask questions in Georgian and get answers from the AI.
*   **Scoped Knowledge Base:** The AI's knowledge is strictly limited to the content of the `data.txt` file.
*   **Simple Interface:** An intuitive and easy-to-use user interface.
*   **Asynchronous API Integration:** Communicates with the Google Gemini API to provide answers.

## Getting Started

### Prerequisites

*   A modern web browser (e.g., Google Chrome, Mozilla Firefox).
*   A Google Gemini API key.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/georgian-corruption-qa.git
    cd georgian-corruption-qa
    ```

2.  **Configure the API Key:**
    *   In the project's root directory, you will find a file named `config.js`.
    *   Open `config.js` and replace `"YOUR_API_KEY"` with your actual Google Gemini API key.

    ```javascript
    // config.js
    const API_KEY = "YOUR_API_KEY";
    ```

## Usage

1.  Open the `index.html` file in your web browser.
2.  Enter your question in the input field.
3.  Click the "Ask" button to receive an answer from the AI.

## Contributing

Contributions are welcome. If you would like to contribute to the project, please open an issue or submit a pull request.

## License

This project is unlicensed and is protected by default copyright laws.