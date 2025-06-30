# HealthBridge: Your Personal AI Health Assistant 🩺

**Turn your scattered medical records into clear, understandable insights with the power of AI.**

## What is this?

HealthBridge is a full-stack web application that acts as your personal health record assistant. Upload your medical documents—prescriptions, lab results, doctor's notes, even medical images—and our AI will analyze them to give you a clear, concise summary of what you need to know.

No more deciphering medical jargon or trying to remember what the doctor said. HealthBridge makes it easy to understand and manage your health information.

## How it Works

HealthBridge is built with a modern tech stack to provide a seamless and secure experience:

*   **Frontend:** A beautiful and intuitive React application for uploading and viewing your health records.
*   **Backend:** A robust Node.js and Express server that handles authentication, file uploads, and communication with the AI service.
*   **Database:** MongoDB for securely storing your health records.
*   **AI:** Google's Gemini API for state-of-the-art text summarization and image analysis.

When you upload a document, it's securely stored and then sent to the Gemini API for analysis. The AI-generated summary is then saved and displayed in your dashboard, giving you instant access to the information you need.

## What's so cool about it?

*   **AI-Powered Summaries:** Our app uses the Gemini API to read through your medical documents and provide you with a simple, easy-to-understand summary.
*   **Image Analysis:** Got a picture of a rash or a photo of a medical device? Upload it! Our AI can analyze medical images and give you information about what it sees.
*   **Secure and Private:** Your health information is sensitive, and we take that seriously. All your data is stored securely and is only accessible to you.
*   **Easy to Use:** We've designed HealthBridge to be as simple and intuitive as possible. No technical skills required!

## Technologies Used

*   **Frontend:** React, TypeScript, Tailwind CSS
*   **Backend:** Node.js, Express, TypeScript
*   **Database:** MongoDB
*   **AI:** Google Gemini API
*   **Authentication:** Google OAuth 2.0

## How to Run

1.  **Start the Backend Server:**
    ```bash
    cd backend
    npm install
    npm run dev
    ```
2.  **Start the Frontend Server:**
    ```bash
    cd frontend
    npm install
    npm start