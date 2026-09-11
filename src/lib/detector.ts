export type Verdict = "REAL" | "FAKE";

export type Analysis = {
  id: string;
  headline: string;
  verdict: Verdict;
  confidence: number;
  time: string;
  user: string;
};

const FAKE_CUES = [
  "shocking",
  "miracle",
  "cure for all",
  "you won't believe",
  "secret",
  "conspiracy",
  "aliens",
  "overnight",
  "100%",
  "banned",
  "hoax",
  "exposed",
  "doctors hate",
  "instantly",
  "free money",
];

const REAL_CUES = [
  "according to",
  "researchers",
  "study",
  "council",
  "ministry",
  "reported",
  "university",
  "official",
  "data",
  "published",
  "peer-reviewed",
  "spokesperson",
];

/** Front-end demo classifier that mimics the Flask + TF-IDF response shape. */
export function classify(text: string): { verdict: Verdict; confidence: number; tokens: number } {
  const lower = text.toLowerCase();
  let score = 0;
  for (const cue of FAKE_CUES) if (lower.includes(cue)) score -= 1.4;
  for (const cue of REAL_CUES) if (lower.includes(cue)) score += 1.2;
  if (text.replace(/[^A-Z]/g, "").length > text.length * 0.25) score -= 1;
  if ((text.match(/!/g) ?? []).length >= 2) score -= 0.8;
  if (text.length > 220) score += 0.5;

  const verdict: Verdict = score >= 0 ? "REAL" : "FAKE";
  const magnitude = Math.min(Math.abs(score), 4);
  const confidence = Math.round(62 + (magnitude / 4) * 35);
  const tokens = text.trim().split(/\s+/).filter(Boolean).length;

  return { verdict, confidence: Math.min(confidence, 98), tokens };
}

export const SAMPLE_NEWS = [
  {
    label: "Sample · likely real",
    text: "According to researchers at the Meridian Institute, a stable fusion reaction was sustained for 42 minutes on Tuesday, the longest continuous output published this year.",
  },
  {
    label: "Sample · likely fake",
    text: "SHOCKING! Doctors hate this one secret miracle cure for all cancers, discovered overnight and banned instantly!!",
  },
];

export const SEED_HISTORY: Analysis[] = [
  {
    id: "a1",
    headline: "Meridian fusion reaction sustained for 42 minutes",
    verdict: "REAL",
    confidence: 87,
    time: "09:14",
    user: "student@college.edu",
  },
  {
    id: "a2",
    headline: "Cure for all cancers discovered in single trial",
    verdict: "FAKE",
    confidence: 96,
    time: "08:47",
    user: "student@college.edu",
  },
  {
    id: "a3",
    headline: "City council approves riverside transit corridor",
    verdict: "REAL",
    confidence: 81,
    time: "08:12",
    user: "guest@college.edu",
  },
  {
    id: "a4",
    headline: "AI replaces 90% of doctors by next year",
    verdict: "FAKE",
    confidence: 92,
    time: "07:55",
    user: "guest@college.edu",
  },
  {
    id: "a5",
    headline: "University laboratory publishes battery life findings",
    verdict: "REAL",
    confidence: 90,
    time: "07:20",
    user: "student@college.edu",
  },
  {
    id: "a6",
    headline: "Mystery light seen over the harbour at dawn",
    verdict: "FAKE",
    confidence: 71,
    time: "06:58",
    user: "guest@college.edu",
  },
];
