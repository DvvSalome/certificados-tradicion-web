// Cliente NIM (NVIDIA, OpenAI-compatible). Port de _leo-pr/src/llm/nvidiaClient.ts a ESM.
// Reintentos con backoff exponencial ante 429/5xx/red. NUNCA loguea la key.
const BASE = process.env.LLM_BASE_URL || 'https://integrate.api.nvidia.com/v1';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const backoff = (n) => Math.min(20000, 1000 * 2 ** (n - 1)) + Math.floor(Math.random() * 400);
const transient = (e) => /HTTP (429|5\d\d)|ECONN|ETIMEDOUT|EAI_AGAIN|fetch failed|network|socket/i.test(String(e?.message || e));

// messages: array OpenAI ({role, content}). content puede ser string o array (texto + image_url) para visión.
export async function nimChat(messages, { model, json = false, maxTokens = 2048 } = {}) {
  const key = process.env.NVIDIA_API_KEY;
  if (!key) throw new Error('NVIDIA_API_KEY no seteada (requerida para el Estudio)');
  const mdl = model || process.env.LLM_MODEL || 'meta/llama-3.3-70b-instruct';
  const body = JSON.stringify({ model: mdl, temperature: 0, top_p: 1, max_tokens: maxTokens, ...(json ? { response_format: { type: 'json_object' } } : {}), messages });
  const maxAttempts = Number(process.env.LLM_MAX_RETRIES || 5);
  const timeoutMs = Number(process.env.LLM_REQUEST_TIMEOUT_MS || 120000);
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), timeoutMs);
    try {
      const res = await fetch(`${BASE}/chat/completions`, { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body, signal: ac.signal });
      if (res.status === 429 || res.status >= 500) {
        const ra = Number(res.headers.get('retry-after')) || 0;
        lastErr = new Error(`NIM HTTP ${res.status}: ${(await res.text().catch(() => '')).slice(0, 200)}`);
        if (attempt < maxAttempts) { await sleep(ra > 0 ? ra * 1000 : backoff(attempt)); continue; }
        throw lastErr;
      }
      if (!res.ok) throw new Error(`NIM HTTP ${res.status}: ${(await res.text().catch(() => '')).slice(0, 300)}`);
      const j = await res.json();
      const c = j.choices?.[0]?.message?.content;
      if (typeof c !== 'string') throw new Error('NIM sin contenido');
      return c;
    } catch (e) {
      lastErr = e;
      const aborted = e?.name === 'AbortError';
      if (attempt < maxAttempts && (aborted || transient(e))) { await sleep(backoff(attempt)); continue; }
      throw aborted ? new Error(`NIM timeout tras ${timeoutMs}ms`) : e;
    } finally { clearTimeout(t); }
  }
  throw lastErr;
}
