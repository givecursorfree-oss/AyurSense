/**
 * AyurSense — AyurGenix V9.2 clinical API (Hugging Face Gradio Space)
 * Space: hnninioi/AyurGenixV9-API
 * Endpoint: /gradio_api/call/generate_report
 *
 * Uses the Gradio HTTP/SSE API with credentials omitted so browser CORS
 * works from https://ayursense.vercel.app (@gradio/client forces credentials:include).
 *
 * @see https://huggingface.co/spaces/hnninioi/AyurGenixV9-API
 */

export const HF_SPACE_ID = 'hnninioi/AyurGenixV9-API';
export const HF_SPACE_URL = 'https://hnninioi-ayurgenixv9-api.hf.space';
export const API_GENERATE_REPORT = '/generate_report';

const CALL_PATH = '/gradio_api/call/generate_report';
const REQUEST_TIMEOUT_MS = 180_000;

/** @typedef {'Summer' | 'Monsoon' | 'Winter' | 'Spring' | 'Autumn'} Season */
/** @typedef {'Male' | 'Female' | 'Other'} Gender */

/**
 * @param {object} params
 * @param {string} params.symptoms - Required clinical symptoms text
 * @param {Season} [params.season='Summer']
 * @param {number} [params.age=30]
 * @param {Gender} [params.gender='Male']
 * @returns {Promise<string>} Clinical Intelligence Report (plain text)
 */
export async function analyzePatient({
  symptoms,
  season = 'Summer',
  age = 30,
  gender = 'Male',
}) {
  const eventId = await enqueuePrediction([
    String(symptoms).trim(),
    season,
    Number(age),
    gender === 'Other' ? 'Male' : gender,
  ]);
  return pollPrediction(eventId);
}

/**
 * @param {unknown[]} data
 * @returns {Promise<string>}
 */
async function enqueuePrediction(data) {
  const response = await fetch(`${HF_SPACE_URL}${CALL_PATH}`, {
    method: 'POST',
    credentials: 'omit',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(
      `Clinical API enqueue failed (${response.status}). ${detail.slice(0, 180)}`.trim(),
    );
  }

  const payload = await response.json();
  const eventId = payload?.event_id;
  if (!eventId) {
    throw new Error('Clinical API did not return an event_id.');
  }
  return String(eventId);
}

/**
 * Gradio streams SSE: event: complete / data: [...]
 * @param {string} eventId
 * @returns {Promise<string>}
 */
async function pollPrediction(eventId) {
  const response = await fetch(`${HF_SPACE_URL}${CALL_PATH}/${eventId}`, {
    method: 'GET',
    credentials: 'omit',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Clinical API poll failed (${response.status}).`);
  }

  const raw = await response.text();
  const report = parseGradioSse(raw);
  if (!report) {
    throw new Error('Empty response from clinical analysis API.');
  }
  return report;
}

/**
 * @param {string} sseText
 * @returns {string | null}
 */
export function parseGradioSse(sseText) {
  const blocks = String(sseText ?? '')
    .split(/\n\n+/)
    .map((b) => b.trim())
    .filter(Boolean);

  for (let i = blocks.length - 1; i >= 0; i -= 1) {
    const block = blocks[i];
    const eventMatch = block.match(/^event:\s*(\w+)/m);
    const dataMatch = block.match(/^data:\s*(.+)$/ms);
    if (!dataMatch) continue;

    let parsed;
    try {
      parsed = JSON.parse(dataMatch[1].trim());
    } catch {
      continue;
    }

    const eventName = eventMatch?.[1] ?? '';
    if (eventName === 'error') {
      const msg =
        typeof parsed === 'string'
          ? parsed
          : parsed?.error || parsed?.message || JSON.stringify(parsed);
      throw new Error(String(msg));
    }

    if (Array.isArray(parsed) && parsed.length > 0) {
      return typeof parsed[0] === 'string' ? parsed[0] : String(parsed[0]);
    }
    if (typeof parsed === 'string') return parsed;
  }

  return null;
}

/**
 * Kept for callers that still receive Gradio client-shaped results.
 * @param {{ data?: unknown }} result
 * @returns {string}
 */
export function extractReportText(result) {
  const { data } = result ?? {};
  if (typeof data === 'string') return data;
  if (Array.isArray(data) && data.length > 0) {
    return typeof data[0] === 'string' ? data[0] : String(data[0]);
  }
  if (data != null) return String(data);
  throw new Error('Empty response from clinical analysis API.');
}

/**
 * @param {unknown} err
 * @returns {string}
 */
export function formatApiError(err) {
  if (err instanceof Error) {
    const msg = err.message || '';
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
      return 'Could not reach AyurGenix V9.2. Ensure the Hugging Face Space is public and running, then try again.';
    }
    if (msg.includes('AbortError') || msg.includes('TimeoutError') || msg.includes('timed out')) {
      return 'The clinical model is still waking up or taking too long. Wait ~30s and submit again.';
    }
    if (msg.includes('endpoint matching')) {
      return 'API endpoint mismatch. Expected /generate_report on AyurGenixV9-API.';
    }
    if (msg.includes('Could not resolve') || msg.includes('No API')) {
      return 'Could not reach AyurGenix V9.2. Ensure the Hugging Face Space is public and running.';
    }
    return msg;
  }
  return 'Connection failed. Ensure the Hugging Face Space is running and public.';
}
