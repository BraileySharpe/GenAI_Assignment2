# Prompt Proxy (Assignment 2: Architecting the Prompt Proxy)

This project implements a middleware-style **Prompt Proxy** that:

* Accepts simple user input
* Wraps it with a selected system persona + hardcoded developer rules
* Sends the final payload to **Meta Llama 3 (8B Instruct)** via the **Hugging Face Inference Router**
* Displays the model output in a clean UI
* Displays the exact prompt payload sent to the model
* Dynamically controls temperature (0.0–1.0) from a slider

---

## Model Provider

This application uses:

**Model:**
`meta-llama/Meta-Llama-3-8B-Instruct`

**Provider:**
Hugging Face Inference Router
`https://router.huggingface.co/v1/chat/completions`

The backend communicates with Hugging Face using an OpenAI-compatible endpoint while keeping the API key secure on the server.

---

## Setup

### 1) Install server dependencies

```bash
cd server
npm install
```

---

### 2) Create a Hugging Face Access Token

1. Go to: [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Create a new token
3. Enable:
   * “Make calls to Inference Providers”
4. Accept the Llama 3 license at:
   [https://huggingface.co/meta-llama/Meta-Llama-3-8B-Instruct](https://huggingface.co/meta-llama/Meta-Llama-3-8B-Instruct)

---

### 3) Create a `.env` file in `/server`

```
API_KEY=hf_your_token_here
HF_MODEL=meta-llama/Meta-Llama-3-8B-Instruct
PORT=3000
```

A sample .env has already been provided.
---

### 4) Start the server

```bash
node server.js
```

Then open:

```
http://localhost:3000
```

---

## Architecture Overview

Frontend → Express Proxy → Hugging Face Router → Meta Llama 3 → Response → UI

The backend constructs:

* System message = Persona + Developer Rules
* User message = Raw user input
* Model parameters = temperature

The final structured payload is displayed in the UI for inspection.

---

## Temperature Behavior

Meta Llama deployments typically accept temperature in the range:

```
0.0 – 1.0
```

Higher values may result in provider errors.
