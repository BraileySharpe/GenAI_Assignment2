# Prompt Proxy (Assignment 2: Architecting the Prompt Proxy)
## By Brailey Sharpe

This project implements a middleware-style **Prompt Proxy** that:

* Accepts simple user input
* Wraps it with a selected system persona + hardcoded developer rules
* Sends the final payload to **GLM-5** via the **Hugging Face Inference Router**
* Displays the model output in a clean UI
* Displays the exact prompt payload sent to the model
* Dynamically controls temperature (0.0–1.0) from a slider

---

## Model Provider

This application uses:

**Model:**
`zai-org/GLM-5`

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
4. Ensure you have access to the model at:
   [https://huggingface.co/zai-org/GLM-5](https://huggingface.co/zai-org/GLM-5)

---

### 3) Create a `.env` file in `/server`

```
API_KEY=hf_your_token_here
HF_MODEL=zai-org/GLM-5
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

## Temperature Behavior

GLM-5 deployments typically accept temperature in the range:

```
0.0 – 1.0
```

Higher values may result in provider errors.
