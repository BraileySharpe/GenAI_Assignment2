const personaSelect = document.getElementById("persona");
const personaHelp = document.getElementById("personaHelp");
const tempSlider = document.getElementById("temp");
const tempValue = document.getElementById("tempValue");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const demoBtn = document.getElementById("demoBtn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const metaEl = document.getElementById("meta");
const submittedPromptEl = document.getElementById("submittedPrompt");

function setStatus(msg) {
    statusEl.textContent = msg || "";
}

function setLoading(isLoading) {
    sendBtn.disabled = isLoading;
    demoBtn.disabled = isLoading;
    sendBtn.textContent = isLoading ? "Sending..." : "Send";
}

tempSlider.addEventListener("input", () => {
    tempValue.textContent = Number(tempSlider.value).toFixed(1);
});

demoBtn.addEventListener("click", () => {
    userInput.value = `Write TWO short responses to the same prompt:
Prompt: "Describe a rainy night in a small town."

Response A: Deterministic and plain, minimal imagery.
Response B: Highly creative, vivid imagery, surprising metaphors.

Keep each response under 80 words.`;
    setStatus("Demo prompt loaded. Try T=0.0 then T=1.7 and compare.");
});

async function loadPersonas() {
    const res = await fetch("/api/personas");
    const data = await res.json();

    personaSelect.innerHTML = "";
    for (const p of data.personas) {
        const opt = document.createElement("option");
        opt.value = p.key;
        opt.textContent = p.label;
        personaSelect.appendChild(opt);
    }

    personaSelect.value = "software_engineer";
    personaHelp.textContent =
        data.personas.find((p) => p.key === personaSelect.value)?.description || "";
}

personaSelect.addEventListener("change", async () => {
    const res = await fetch("/api/personas");
    const data = await res.json();
    personaHelp.textContent =
        data.personas.find((p) => p.key === personaSelect.value)?.description || "";
});

sendBtn.addEventListener("click", async () => {
    const input = userInput.value.trim();
    if (!input) {
        setStatus("Please enter a prompt.");
        return;
    }

    setLoading(true);
    setStatus("Waiting for model...");
    resultEl.textContent = "";
    metaEl.textContent = "";
    submittedPromptEl.textContent = "";

    try {
        const payload = {
            userInput: input,
            personaKey: personaSelect.value,
            temperature: Number(tempSlider.value),
        };

        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
            if (data?.submittedPayload) {
                submittedPromptEl.textContent = JSON.stringify(
                    data.submittedPayload,
                    null,
                    2
                );
            }
            throw new Error(data?.error || "Request failed");
        }

        if (data?.submittedPayload) {
            submittedPromptEl.textContent = JSON.stringify(
                data.submittedPayload,
                null,
                2
            );
        }

        metaEl.textContent = `temperature: ${data.temperature}`;
        resultEl.textContent = data.result;
        setStatus("Done.");
    } catch (err) {
        resultEl.textContent = `Error: ${String(err.message || err)}`;
        setStatus("Error.");
    } finally {
        setLoading(false);
    }
});

loadPersonas().catch(() => setStatus("Failed to load personas."));