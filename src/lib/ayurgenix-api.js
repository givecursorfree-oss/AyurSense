/**
 * AyurSense — AyurGenix V9 clinical API (Hugging Face Gradio)
 * Space: hnninioi/AyurGenixV9-API
 * Endpoint: /generate_report
 *
 * @see https://huggingface.co/spaces/hnninioi/AyurGenixV9-API
 */
import { Client } from '@gradio/client';

export const HF_SPACE_ID = 'hnninioi/AyurGenixV9-API';
export const API_GENERATE_REPORT = '/generate_report';

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
  const client = await Client.connect(HF_SPACE_ID);

  const result = await client.predict(API_GENERATE_REPORT, [
    String(symptoms).trim(),
    season,
    Number(age),
    gender,
  ]);

  return extractReportText(result);
}

/**
 * Gradio returns a single str in `data` (array or string depending on client version).
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
    if (msg.includes('endpoint matching')) {
      return 'API endpoint mismatch. Expected /generate_report on AyurGenixV9-API.';
    }
    if (msg.includes('Could not resolve') || msg.includes('No API')) {
      return 'Could not reach AyurGenix V9. Ensure the Hugging Face Space is public and running.';
    }
    return msg;
  }
  return 'Connection failed. Ensure the Hugging Face Space is running and public.';
}
