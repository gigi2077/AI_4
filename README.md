## **Project Description: AI-Powered Georgian Corruption Case Q\&A**

### **Executive Summary**

This project is a web-based application that provides a simple, user-friendly interface for the public to ask questions about a specific document detailing alleged high-level corruption cases in Georgia. It leverages the Google Gemini AI model to understand and answer user queries in natural language, with the responses based exclusively on the provided text. This ensures that the information is unbiased and serves as a reliable tool for citizens, journalists, and researchers.

### **Problem Statement & Project Goals**

Accessing and understanding complex legal and investigative documents can be challenging for the general public. The information is often dense and lengthy, making it difficult to extract specific information. This project addresses the need for a more accessible way to engage with important civic data, specifically the "[Alleged Cases of High-Level Corruption \- A Periodically Updated List](https://transparency.ge/ge/blog/magali-donis-korupciis-savaraudo-shemtxvevebi-ganaxlebadi-sia)" by Transparency International Georgia.

The primary goals are:

* To increase public access to and understanding of the information in the source document.  
* To provide a tool for journalists and researchers to quickly find information within the text.  
* To demonstrate a practical application of large language models for civic tech.

### **How It Works: From Question to Answer**

The application transforms the static article into an interactive and easily searchable resource. Here’s the journey of a user's question:

1. **The User Asks a Question:** A user visits the webpage and types their question in plain Georgian into the input box.  
2. **The Front-End Gathers Context:** The website's code takes the user's question and reads the entire knowledge base—a text file (data.txt) containing the curated information from the Transparency International Georgia article.  
3. **A Detailed Prompt is Created:** The user's question and the knowledge base are combined into a single, detailed instruction (a "prompt"). This prompt strictly commands the AI to answer *only* using the provided text, to respond in Georgian, and to cite its source.  
4. **The Back-End Makes the AI Call:** The prompt is sent securely to a Netlify Serverless Function, which acts as a middleman. It takes the prompt and sends it to Google's AI servers using a secure API key.  
5. **Google's Gemini AI Generates an Answer:** The powerful **Gemini 2.5 Flash AI model** reads the instructions and finds the relevant information within the text to formulate a concise answer and citation.  
6. **The Answer is Displayed:** The AI's answer is sent back through the Netlify Function to the user's web browser, where it is displayed neatly in the answer box.

### **Technical Architecture and Design**

The application is a single-page web application (SPA) with a serverless backend.

graph TD  
    A\[User's Browser\] \--\>|HTTPS Request| B(Netlify Server);  
    B \--\> C{index.html};  
    C \--\> A;  
    A \--\>|API Call to /api/prompt| B;  
    B \--\>|Invokes Function| D\[Netlify Function: prompt.js\];  
    D \--\>|Sends Prompt| E\[Google Gemini API\];  
    E \--\>|Returns Answer| D;  
    D \--\>|Sends Response| A;

* **Frontend:** HTML, CSS, JavaScript  
* **Backend:** Node.js (for Netlify Functions)  
* **AI Model:** Google Gemini 2.5 Flash  
* **Hosting:** Netlify

### **Data Acquisition and Updates**

The core knowledge base of this application is the `data.txt` file, which contains the text from the Transparency International Georgia article. To ensure the information is always current, a Python script (`update_data.py`) automates the updating process.

Here’s how it works:

1.  **Fetching:** The script sends a request to the article's URL.
2.  **Parsing:** It uses the `BeautifulSoup` library to parse the raw HTML and precisely extracts the main article content, discarding irrelevant elements like headers, footers, and ads.
3.  **Cleaning & Conversion:** The extracted HTML is converted into clean, readable Markdown format.
4.  **Saving:** The final Markdown text is saved into `data.txt`, overwriting the old content.

This process is automatically triggered every time the site is deployed on Netlify, as defined in the `netlify.toml` configuration file. This guarantees that the AI's answers are always based on the latest version of the public document.

### **Target Audience**

* **General Public:** Citizens of Georgia who are interested in issues of corruption.  
* **Journalists:** Reporters who need to quickly find information for their stories.  
* **Researchers:** Academics and analysts studying corruption in Georgia.