# FINAI

FINAI is a full-stack financial AI application with a **React Native (Expo)** frontend and a **Node.js (Express.js)** backend.  
It integrates **Plaid using a native SDK build** and uses **Ollama with LLaMA 3** for local AI capabilities.

---

## Project Structure

```

Fin-AI/
├── backend/        # Node.js + Express backend
├── frontend/       # Expo + React Native frontend
├── .gitignore
├── LICENSE
├── README.md

````

---

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18 or later recommended)
- **npm** or **yarn**
- **Expo CLI** (via npx)
- **Xcode** (required for iOS builds)
- **Ollama** (for running LLaMA 3 locally)

---

2. Open `.env` and fill in all required values such as:

   * Plaid credentials
   * Backend port
   * API keys
   * Any required secrets

> ⚠️ Do NOT commit your `.env` file to version control.

---

## Backend Setup (Node.js + Express.js)

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install backend dependencies:

   ```bash
   npm install
   ```

3. Start the backend server:

   ```bash
   npm run dev
   ```

   or

   ```bash
   npm start
   ```

The backend server should now be running locally.

## Environment Variables Setup

FINAI backend requires environment variables to be set before running.

1. Copy the example environment file in the backend directory:
   ```bash
   cp .env.example .env
````

---

## Frontend Setup (Expo + React Native)

The frontend uses **Expo with a native build** because **Plaid requires native SDK support**.

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. Run the iOS app using a native build:

   ```bash
   npx expo run:ios
   ```

> ℹ️ Expo Go is **not supported** due to native Plaid SDK requirements.

---

## Plaid Integration Notes

* Plaid is integrated using the **native Plaid SDK**
* Requires a **bare / native Expo build**
* Ensure all Plaid-related environment variables are correctly set

---

## Ollama Setup (Local AI)

FINAI uses **Ollama** to run **LLaMA 3** locally for AI features.

### Install Ollama

Download and install Ollama from the official site:

[https://ollama.com](https://ollama.com)

---

### Start Ollama Server

Open a **separate terminal window** and run:

```bash
ollama serve
```

---

### Run LLaMA 3 Model

In another terminal (or after the server starts), run:

```bash
ollama run llama3
```

> ⚠️ Ollama must be running for FINAI’s AI features to work.

---

## Running the Full Application

You should have **three terminals running at the same time**:

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

### Terminal 2 — Frontend

```bash
cd frontend
npx expo run:ios
```

### Terminal 3 — Ollama

```bash
ollama serve
ollama run llama3
```
### Terminal 4 — ML

```bash
cd backend/ML

#1 Check both python and pip are installed
python --version
pip --version

#2 Create a virtual environment
python -m venv venv
source venv/bin/activate        # macOS / Linux
venv\Scripts\activate           # Windows

#3 Install dependencies inside the requirements.txt file. 
pip install -r requirements.txt

#4 Run the file
python creditCard_Recommendation.py


```
---

## Common Issues & Tips

* Ensure `.env` values are correct
* Restart Metro bundler if Expo hangs
* Confirm Ollama is running before using AI features
* Use a real iOS simulator or device for Plaid testing

---

## License

This project is licensed under the terms specified in the `LICENSE` file.

---

## FINAI

Financial Intelligence powered by AI 🚀
