let sessionId = localStorage.getItem("session_id");

export async function sendRequest(endpoint, method = "POST", body = null) {
  const headers = { "Content-Type": "application/json" };
  if (sessionId) headers["X-Session-ID"] = sessionId;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(endpoint, options);
    if (!response.ok) {
      const errorData = await response.json();
      alert("Feil: " + errorData.error);
      return null;
    }

    const newSessionId = response.headers.get("X-Session-ID");
    if (newSessionId && newSessionId !== sessionId) {
      sessionId = newSessionId;z
      localStorage.setItem("session_id", sessionId);
    }

    return response.json();
  } catch (error) {
    console.error("Feil:", error);
    alert("Feil: " + error.message);
    return null;
  }
}
