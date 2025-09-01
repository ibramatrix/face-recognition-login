// change BASE to your Linux VM IP:8000
export const BASE = "http://<YOUR IP HERE>:8000"; // <-- REPLACE THIS

export async function registerAPI(username, frames_b64) {
  const res = await fetch(`${BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, frames_b64 })
  });
  return res.json();
}

export async function loginAPI(username, frames_b64) {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, frames_b64 })
  });
  return { status: res.status, data: await res.json() };
}

export async function meAPI(token) {
  const res = await fetch(`${BASE}/me?token=${encodeURIComponent(token)}`);
  return res.json();
}
